# Arcanist's Dice - Web Catalog

Static product catalog for **Arcanist's Dice** (El Salvador).
Site: [www.arcanistsdice.com](https://www.arcanistsdice.com) (Spanish at `/`, English at `/en/`)

The docs for picking up the work (current state, decisions, architecture, rules and screens) are in [`docs/README.md`](docs/README.md).

---

## Project structure

```
arcanist/
├── scripts/
│   └── generate-manifest/   <- Script that reads Google Drive and builds the catalog
├── arcanist-catalog/        <- Next.js website
└── docs/                    <- Project docs and mockups
```

---

## 1. Generate the catalog (manifest)

The script reads the Google Drive folder and writes `arcanist-catalog/src/data/catalog.json`.

### Requirements (first time)

1. Put the service account key file in:
   ```
   scripts/generate-manifest/service-account-key.json
   ```
   > This file is NOT committed to git (the repo is public). The owner keeps it in Google Drive, in `My Drive/3D Arcanist/`. Copy it with the name `service-account-key.json` and protect it with `chmod 600 service-account-key.json`.

2. Check that `rootFolderId` in `scripts/generate-manifest/config.json` is correct:
   ```json
   {
     "rootFolderId": "ROOT_FOLDER_ID_IN_DRIVE"
   }
   ```
   The ID comes from the Google Drive URL:
   `https://drive.google.com/drive/folders/`**`THIS_IS_THE_ID`**

3. Install dependencies (first time only):
   ```bash
   cd scripts/generate-manifest
   npm install
   ```

### Run the script

First, a test run that changes nothing (it doesn't touch sharing in Drive and writes to a temp folder):

```bash
cd scripts/generate-manifest
node index.js --dry-run
```

To generate the catalog for real:

```bash
cd scripts/generate-manifest
node index.js
```

The script will:
- Walk the root folder in Google Drive in three levels: TYPE > BRAND > PRODUCT (for example `01 Figures/Tanuki/Voldemort`). The type's number sets the menu order
- Read the `meta.txt` in each product folder
- Skip products without a `meta.txt`
- Put each product's `cover` image first (see below)
- Include products without photos; the site shows them as "Fotos pronto"
- Make the images public in Google Drive automatically
- Write `arcanist-catalog/src/data/catalog.json`
- Write `docs/catalog-status.md`: products without photos, without a `cover`, and skipped folders
- Stop without writing anything if a `meta.txt` can't be read (network or login error), so a run never drops products from the catalog; run it again

A dry run takes about 4 minutes and a real run about 12 (it confirms sharing on every photo) when the Mac stays awake; `caffeinate -i node index.js` keeps it from sleeping. The login renews itself if a run outlasts Google's one-hour token.

### `meta.txt` format

Every product folder in Google Drive needs a `meta.txt` file:

```
name=Product Name
tags=tag1,tag2,tag3
images=Image_1.jpg, Image_3.jpg
```

| Field  | Required | Description                                                  |
|--------|----------|--------------------------------------------------------------|
| name   | Yes      | Product name                                                 |
| tags   | No       | Comma-separated tags                                         |
| images | No       | Specific images to show. If left out, all images are used    |

The type and the brand come from the folders, so `category=` and `brand=` aren't needed anymore. `meta.txt` files that have them still work; if they don't match the folder, the script warns and uses the folder. Details in [`docs/drive-images-schema.md`](docs/drive-images-schema.md).

### Cover image (`cover`)

In each product folder, the image named `cover` (or `Cover`, with any extension: `cover.jpg`, `Cover.png`...) is the one shown on the catalog card and first when the product opens. The rest follow in name order (`_01`, `_02`, ..., `_10`).

If a folder has no `cover`, the first image by name is used and the script prints a warning. At the end it says how many products have no `cover`.

### IDs

Each product's id is brand + name (`tanuki-voldemort`), because some characters exist in two brands.

---

## 2. Run the site locally

### Requirements

- Node.js 18 or newer

### Install (first time)

```bash
cd arcanist-catalog
npm install
```

### Development mode

```bash
cd arcanist-catalog
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in the browser.

### Production build

```bash
cd arcanist-catalog
npm run build
```

Writes the `out/` folder with the static site, ready to deploy.

---

## 3. Catalog update flow

When the owner adds new products in Google Drive:

```bash
# 1. Create a branch
git checkout -b data/catalog-YYYY-MM-DD

# 2. Generate the new catalog (makes the new photos public in Drive)
cd scripts/generate-manifest
node index.js

# 3. Review the script's summary, catalog.json and docs/catalog-status.md
# 4. Push the branch and open a PR
git add arcanist-catalog/src/data/catalog.json docs/catalog-status.md
git commit
git push -u origin HEAD
gh pr create
```

When the PR is merged, Vercel rebuilds the site automatically within a few minutes. `docs/catalog-status.md` lists the products without photos, without a `cover`, and the skipped folders.

---

## Contact settings

The WhatsApp and Instagram links are set in `arcanist-catalog/src/lib/config.ts`:

```ts
export const SOCIAL = {
  whatsapp: 'https://wa.me/50372364700',
  instagram: 'https://www.instagram.com/arcanistdice',
};
```

The WhatsApp messages (and every text on the site, in Spanish and English) are in `arcanist-catalog/src/i18n/dictionaries.ts`.
