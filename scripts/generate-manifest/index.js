const { getDriveClient } = require('./drive-client');
const { parseMetaTxt } = require('./parser');
const { writeStatusReport } = require('./report');
const config = require('./config.json');
const fs = require('fs');
const os = require('os');
const path = require('path');

// --dry-run: reads Drive without changing any sharing, and writes to a temp folder instead of the repo
const DRY_RUN = process.argv.includes('--dry-run');

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const FOLDER_MIME = 'application/vnd.google-apps.folder';

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getImageUrl(fileId) {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

async function listFolder(drive, folderId) {
  const items = [];
  let pageToken = null;
  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType)',
      pageToken: pageToken || undefined,
      pageSize: 1000,
    });
    items.push(...(res.data.files || []));
    pageToken = res.data.nextPageToken;
  } while (pageToken);
  return items;
}

async function readTextFile(drive, fileId) {
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'text' }
  );
  return typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
}

async function makeFilePublic(drive, fileId) {
  try {
    await drive.permissions.create({
      fileId,
      requestBody: { role: 'reader', type: 'anyone' },
    });
  } catch (err) {
    const msg = err?.errors?.[0]?.message || err.message || '';
    if (!msg.includes('already exists') && !msg.includes('sharingRateLimitExceeded')) {
      console.warn(`    Advertencia: no se pudo hacer publica la imagen ${fileId}: ${msg}`);
    }
  }
}

// "01 Figures" -> { order: 1, name: 'Figures' }; folders without a number sort last
function parseTypeFolder(folderName) {
  const match = folderName.match(/^(\d+)\s+(.+)$/);
  return match
    ? { order: Number(match[1]), name: match[2].trim() }
    : { order: Number.MAX_SAFE_INTEGER, name: folderName.trim() };
}

async function processProductFolder(drive, folder, brandName, typeId) {
  const contents = await listFolder(drive, folder.id);

  const metaFile = contents.find(f => f.name.toLowerCase() === 'meta.txt');
  if (!metaFile) {
    console.log(`    Omitido (sin meta.txt): ${folder.name}`);
    return null;
  }

  let meta;
  try {
    const content = await readTextFile(drive, metaFile.id);
    meta = parseMetaTxt(content);
  } catch (err) {
    console.warn(`    Error leyendo meta.txt de ${folder.name}: ${err.message}`);
    return null;
  }

  if (!meta.name) {
    console.log(`    Omitido (meta.txt incompleto, requiere name): ${folder.name}`);
    return null;
  }

  // The brand comes from the folder; older meta.txt files may still repeat it as category= and brand=
  for (const key of ['category', 'brand']) {
    if (meta[key] && meta[key].toLowerCase() !== brandName.toLowerCase()) {
      console.warn(`    Advertencia: ${key}=${meta[key]} no coincide con la carpeta de marca "${brandName}"; se usa la carpeta`);
    }
  }

  const allImages = contents.filter(
    f => f.mimeType !== FOLDER_MIME && IMAGE_EXTENSIONS.has(path.extname(f.name).toLowerCase())
  );

  let selectedImages = allImages;
  if (meta.images && meta.images.length > 0) {
    const wanted = new Set(meta.images.map(n => n.toLowerCase()));
    selectedImages = allImages.filter(f => wanted.has(f.name.toLowerCase()));
  }

  // The image named "cover" (any case, any extension) goes first; the rest follow in name order
  const isCover = f => path.parse(f.name).name.toLowerCase() === 'cover';
  selectedImages = [...selectedImages].sort(
    (a, b) =>
      isCover(b) - isCover(a) || a.name.localeCompare(b.name, undefined, { numeric: true })
  );

  if (selectedImages.length === 0) {
    console.log(`    Sin fotos todavia (se muestra como "Fotos pronto")`);
  } else if (!isCover(selectedImages[0])) {
    console.warn(`    Advertencia: sin imagen "cover", se usa ${selectedImages[0].name}`);
  }

  const images = [];
  for (const img of selectedImages) {
    if (config.setPublicPermissions !== false && !DRY_RUN) {
      await makeFilePublic(drive, img.id);
    }
    images.push({
      filename: img.name,
      url: getImageUrl(img.id),
    });
  }

  return {
    // Brand + name: some characters exist in two brands (e.g. Nezuko)
    id: slugify(`${brandName} ${meta.name}`),
    name: meta.name,
    type: typeId,
    brand: brandName,
    // The site uses category for the chips and badges; it's the brand folder's name
    category: brandName,
    tags: meta.tags || [],
    images,
  };
}

async function main() {
  console.log("=== Arcanist's Dice - Generador de Catalogo ===\n");
  if (DRY_RUN) console.log('Modo --dry-run: no se cambia ningun permiso en Drive ni se escribe en el repositorio.\n');

  const drive = getDriveClient();
  const products = [];
  const skipped = [];
  const types = [];

  // Images/<NN Type>/<Brand>/<Product>/
  console.log('Explorando carpeta raiz...');
  const rootContents = await listFolder(drive, config.rootFolderId);
  const typeFolders = rootContents.filter(f => f.mimeType === FOLDER_MIME);

  if (typeFolders.length === 0) {
    console.warn('Advertencia: no se encontraron carpetas de tipo en la carpeta raiz.');
  }

  for (const typeFolder of typeFolders) {
    const { order, name: typeName } = parseTypeFolder(typeFolder.name);
    // Two folders with the same type name (e.g. "02 Keycaps" and a leftover "Keycaps") share one menu entry
    let type = types.find(t => t.id === slugify(typeName));
    if (type) {
      console.warn(`\nAdvertencia: "${typeFolder.name}" repite el tipo "${type.name}"; sus productos se juntan en ese tipo`);
      type.order = Math.min(type.order, order);
    } else {
      type = { id: slugify(typeName), name: typeName, order, productIds: [] };
      types.push(type);
    }
    console.log(`\nTipo: ${typeName}`);
    if (order === Number.MAX_SAFE_INTEGER) {
      console.warn(`  Advertencia: "${typeFolder.name}" no tiene numero de orden (ej. "05 ${typeName}"); va al final del menu`);
    }

    const brandFolders = (await listFolder(drive, typeFolder.id)).filter(f => f.mimeType === FOLDER_MIME);
    for (const brand of brandFolders) {
      console.log(`  Marca: ${brand.name}`);
      const productFolders = (await listFolder(drive, brand.id)).filter(f => f.mimeType === FOLDER_MIME);
      console.log(`    ${productFolders.length} producto(s) encontrado(s)`);

      for (const productFolder of productFolders) {
        console.log(`  Procesando: ${productFolder.name}`);
        const product = await processProductFolder(drive, productFolder, brand.name, type.id);
        if (!product) {
          skipped.push({ type: typeName, brand: brand.name, folder: productFolder.name });
        } else {
          products.push(product);
          type.productIds.push(product.id);
          console.log(`    OK: "${product.name}" (${product.images.length} imagen(es))`);
        }
      }
    }
  }

  types.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  const typeName = Object.fromEntries(types.map(t => [t.id, t.name]));
  for (const p of products) p.typeName = typeName[p.type];

  // The id is brand + name; two products with the same id would clash on the site
  const seen = new Map();
  for (const p of products) {
    if (seen.has(p.id)) console.warn(`\nAdvertencia: id repetido "${p.id}" (${seen.get(p.id)} y ${p.brand}/${p.name})`);
    else seen.set(p.id, `${p.brand}/${p.name}`);
  }

  // Category index
  const categoriesMap = new Map();
  for (const p of products) {
    const id = slugify(p.category);
    if (!categoriesMap.has(id)) {
      categoriesMap.set(id, { id, name: p.category, productIds: [] });
    }
    categoriesMap.get(id).productIds.push(p.id);
  }

  // Tag index
  const tagsMap = new Map();
  for (const p of products) {
    for (const tag of p.tags) {
      const id = slugify(tag);
      if (!tagsMap.has(id)) {
        tagsMap.set(id, { id, name: tag, productIds: [] });
      }
      tagsMap.get(id).productIds.push(p.id);
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    products: products.map(({ typeName: _, ...p }) => p),
    types: types.map(({ id, name, order, productIds }) => ({
      id,
      name,
      order: order === Number.MAX_SAFE_INTEGER ? null : order,
      productIds,
    })),
    categories: Array.from(categoriesMap.values()),
    tags: Array.from(tagsMap.values()),
  };

  const outDir = DRY_RUN ? fs.mkdtempSync(path.join(os.tmpdir(), 'arcanist-dry-run-')) : null;
  const outputPath = DRY_RUN ? path.join(outDir, 'catalog.json') : path.resolve(__dirname, config.outputPath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf8');

  const reportPath = DRY_RUN ? path.join(outDir, 'catalog-status.md') : path.resolve(__dirname, config.reportPath);
  writeStatusReport({ generatedAt: manifest.generatedAt, products, skipped }, reportPath);

  console.log('\n=== Resultado ===');
  const withPhotos = products.filter(p => p.images.length > 0);
  const withoutCover = withPhotos.filter(
    p => path.parse(p.images[0].filename).name.toLowerCase() !== 'cover'
  );
  console.log(`Productos:  ${products.length} (${withPhotos.length} con fotos, ${products.length - withPhotos.length} sin fotos)`);
  console.log(`Sin cover:  ${withoutCover.length}`);
  console.log(`Tipos:      ${types.map(t => `${t.name} (${t.productIds.length})`).join(', ')}`);
  console.log(`Categorias: ${categoriesMap.size}`);
  console.log(`Etiquetas:  ${tagsMap.size}`);
  console.log(`Archivo:    ${outputPath}`);
  console.log(`Reporte:    ${reportPath}`);
  console.log(DRY_RUN ? '\nDry run terminado (nada cambio en Drive ni en el repositorio).' : '\nCatalogo generado exitosamente.');
}

main().catch(err => {
  console.error('\nError:', err.message);
  process.exit(1);
});
