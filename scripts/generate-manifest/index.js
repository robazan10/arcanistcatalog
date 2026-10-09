const { getDriveClient } = require('./drive-client');
const { parseMetaTxt } = require('./parser');
const { writeStatusReport } = require('./report');
const config = require('./config.json');
const fs = require('fs');
const path = require('path');

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

async function processProductFolder(drive, folder, brandName) {
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

  if (!meta.name || !meta.category) {
    console.log(`    Omitido (meta.txt incompleto, requiere name y category): ${folder.name}`);
    return null;
  }

  const allImages = contents.filter(
    f => f.mimeType !== FOLDER_MIME && IMAGE_EXTENSIONS.has(path.extname(f.name).toLowerCase())
  );

  let selectedImages = allImages;
  if (meta.images && meta.images.length > 0) {
    const wanted = new Set(meta.images.map(n => n.toLowerCase()));
    selectedImages = allImages.filter(f => wanted.has(f.name.toLowerCase()));
  }

  // La imagen llamada "cover" (cualquier mayuscula/extension) va primero; el resto en orden de nombre
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
    if (config.setPublicPermissions !== false) {
      await makeFilePublic(drive, img.id);
    }
    images.push({
      filename: img.name,
      url: getImageUrl(img.id),
    });
  }

  return {
    // Marca + nombre: hay personajes con el mismo nombre en dos marcas (ej. Nezuko)
    id: slugify(`${brandName} ${meta.name}`),
    name: meta.name,
    brand: brandName,
    category: meta.category,
    tags: meta.tags || [],
    images,
  };
}

async function main() {
  console.log("=== Arcanist's Dice - Generador de Catalogo ===\n");

  const drive = getDriveClient();
  const products = [];
  const skipped = [];

  console.log('Explorando carpeta raiz...');
  const rootContents = await listFolder(drive, config.rootFolderId);
  const brands = rootContents.filter(f => f.mimeType === FOLDER_MIME);

  if (brands.length === 0) {
    console.warn('Advertencia: no se encontraron carpetas de marca en la carpeta raiz.');
  }

  for (const brand of brands) {
    console.log(`\nMarca: ${brand.name}`);
    const brandContents = await listFolder(drive, brand.id);
    const productFolders = brandContents.filter(f => f.mimeType === FOLDER_MIME);
    console.log(`  ${productFolders.length} producto(s) encontrado(s)`);

    for (const productFolder of productFolders) {
      console.log(`  Procesando: ${productFolder.name}`);
      const product = await processProductFolder(drive, productFolder, brand.name);
      if (!product) {
        skipped.push({ brand: brand.name, folder: productFolder.name });
      } else {
        products.push(product);
        console.log(`    OK: "${product.name}" (${product.images.length} imagen(es))`);
      }
    }
  }

  // Indice de categorias
  const categoriesMap = new Map();
  for (const p of products) {
    const id = slugify(p.category);
    if (!categoriesMap.has(id)) {
      categoriesMap.set(id, { id, name: p.category, productIds: [] });
    }
    categoriesMap.get(id).productIds.push(p.id);
  }

  // Indice de etiquetas
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
    products,
    categories: Array.from(categoriesMap.values()),
    tags: Array.from(tagsMap.values()),
  };

  const outputPath = path.resolve(__dirname, config.outputPath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf8');

  const reportPath = path.resolve(__dirname, config.reportPath);
  writeStatusReport({ generatedAt: manifest.generatedAt, products, skipped }, reportPath);

  console.log('\n=== Resultado ===');
  const withPhotos = products.filter(p => p.images.length > 0);
  const withoutCover = withPhotos.filter(
    p => path.parse(p.images[0].filename).name.toLowerCase() !== 'cover'
  );
  console.log(`Productos:  ${products.length} (${withPhotos.length} con fotos, ${products.length - withPhotos.length} sin fotos)`);
  console.log(`Sin cover:  ${withoutCover.length}`);
  console.log(`Categorias: ${categoriesMap.size}`);
  console.log(`Etiquetas:  ${tagsMap.size}`);
  console.log(`Archivo:    ${outputPath}`);
  console.log(`Reporte:    ${reportPath}`);
  console.log('\nCatalogo generado exitosamente.');
}

main().catch(err => {
  console.error('\nError:', err.message);
  process.exit(1);
});
