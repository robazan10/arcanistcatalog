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

// The site's photo frame per type ("4/5"), as width / height; other types are square
const PHOTO_FRAMES = Object.fromEntries(
  Object.entries(require(path.resolve(__dirname, config.photoFramesPath))).map(([type, shape]) => {
    const [w, h] = shape.split('/').map(Number);
    return [type, w / h];
  })
);
// A photo that fills less than this share of its frame is listed in the report (big empty bands around it)
const MIN_FRAME_FILL = 0.75;

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
      fields: 'nextPageToken, files(id, name, mimeType, imageMediaMetadata(width, height, rotation))',
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
      console.warn(`    Warning: could not make image ${fileId} public: ${msg}`);
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
    console.log(`    Skipped (no meta.txt): ${folder.name}`);
    return null;
  }

  let meta;
  try {
    const content = await readTextFile(drive, metaFile.id);
    meta = parseMetaTxt(content);
  } catch (err) {
    // A read error (network, login) would silently drop the product from the live catalog; stop instead
    throw new Error(`could not read meta.txt of ${folder.name}: ${err.message}`);
  }

  if (!meta.name) {
    console.log(`    Skipped (meta.txt has no name=): ${folder.name}`);
    return null;
  }

  // The brand comes from the folder; older meta.txt files may still repeat it as category= and brand=
  for (const key of ['category', 'brand']) {
    if (meta[key] && meta[key].toLowerCase() !== brandName.toLowerCase()) {
      console.warn(`    Warning: ${key}=${meta[key]} doesn't match the brand folder "${brandName}"; using the folder`);
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
    console.log(`    No photos yet (shown as "Fotos pronto")`);
  } else if (!isCover(selectedImages[0])) {
    console.warn(`    Warning: no "cover" image, using ${selectedImages[0].name}`);
  }

  // The site shows the whole photo inside the type's frame; a much wider or taller photo leaves big bands around it
  const frame = PHOTO_FRAMES[typeId] ?? 1;
  const poorFit = [];
  for (const img of selectedImages) {
    const { width, height, rotation } = img.imageMediaMetadata || {};
    if (!width || !height) continue;
    const ratio = rotation % 2 ? height / width : width / height;
    const fill = Math.min(ratio, frame) / Math.max(ratio, frame);
    if (fill < MIN_FRAME_FILL) poorFit.push({ filename: img.name, fill });
  }
  if (poorFit.length) {
    console.warn(`    Note: ${poorFit.length} photo(s) fill under ${MIN_FRAME_FILL * 100}% of the frame`);
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
    // For the report only; not written to catalog.json
    poorFit,
  };
}

async function main() {
  console.log("=== Arcanist's Dice - Catalog generator ===\n");
  if (DRY_RUN) console.log('--dry-run: no sharing changes in Drive, nothing written to the repo.\n');
  const startedAt = Date.now();

  const drive = getDriveClient();
  const products = [];
  const skipped = [];
  const types = [];

  // Images/<NN Type>/<Brand>/<Product>/
  console.log('Reading the root folder...');
  const rootContents = await listFolder(drive, config.rootFolderId);
  const typeFolders = rootContents.filter(f => f.mimeType === FOLDER_MIME);

  if (typeFolders.length === 0) {
    console.warn('Warning: no type folders found in the root folder.');
  }

  for (const typeFolder of typeFolders) {
    const { order, name: typeName } = parseTypeFolder(typeFolder.name);
    // Two folders with the same type name (e.g. "02 Keycaps" and a leftover "Keycaps") share one menu entry
    let type = types.find(t => t.id === slugify(typeName));
    if (type) {
      console.warn(`\nWarning: "${typeFolder.name}" repeats the type "${type.name}"; its products join that type`);
      type.order = Math.min(type.order, order);
    } else {
      type = { id: slugify(typeName), name: typeName, order, productIds: [] };
      types.push(type);
    }
    console.log(`\nType: ${typeName}`);
    if (order === Number.MAX_SAFE_INTEGER) {
      console.warn(`  Warning: "${typeFolder.name}" has no order number (e.g. "05 ${typeName}"); it goes last in the menu`);
    }

    const brandFolders = (await listFolder(drive, typeFolder.id)).filter(f => f.mimeType === FOLDER_MIME);
    for (const brand of brandFolders) {
      console.log(`  Brand: ${brand.name}`);
      const productFolders = (await listFolder(drive, brand.id)).filter(f => f.mimeType === FOLDER_MIME);
      console.log(`    ${productFolders.length} product folder(s)`);

      for (const productFolder of productFolders) {
        console.log(`  Reading: ${productFolder.name}`);
        const product = await processProductFolder(drive, productFolder, brand.name, type.id);
        if (!product) {
          skipped.push({ type: typeName, brand: brand.name, folder: productFolder.name });
        } else {
          products.push(product);
          type.productIds.push(product.id);
          console.log(`    OK: "${product.name}" (${product.images.length} image(s))`);
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
    if (seen.has(p.id)) console.warn(`\nWarning: duplicate id "${p.id}" (${seen.get(p.id)} and ${p.brand}/${p.name})`);
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
    products: products.map(({ typeName: _, poorFit: __, ...p }) => p),
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

  console.log('\n=== Result ===');
  const withPhotos = products.filter(p => p.images.length > 0);
  const withoutCover = withPhotos.filter(
    p => path.parse(p.images[0].filename).name.toLowerCase() !== 'cover'
  );
  console.log(`Products:   ${products.length} (${withPhotos.length} with photos, ${products.length - withPhotos.length} without)`);
  console.log(`No cover:   ${withoutCover.length}`);
  console.log(`Poor fit:   ${products.reduce((n, p) => n + p.poorFit.length, 0)} photo(s) (see the report)`);
  console.log(`Types:      ${types.map(t => `${t.name} (${t.productIds.length})`).join(', ')}`);
  console.log(`Categories: ${categoriesMap.size}`);
  console.log(`Tags:       ${tagsMap.size}`);
  console.log(`Catalog:    ${outputPath}`);
  console.log(`Report:     ${reportPath}`);
  console.log(`Time:       ${Math.round((Date.now() - startedAt) / 60000)} min`);
  console.log(DRY_RUN ? '\nDry run done (nothing changed in Drive or the repo).' : '\nCatalog generated.');
}

main().catch(err => {
  console.error('\nError:', err.message);
  process.exit(1);
});
