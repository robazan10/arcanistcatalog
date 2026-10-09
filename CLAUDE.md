# Arcanist's Dice

Static product catalog for **Arcanist's Dice** (El Salvador): hand-painted resin dice and accessories, shown without prices. Visitors contact the shop through WhatsApp and Instagram.

Live at https://www.arcanistsdice.com. The site's copy is in **Spanish** (`<html lang="es">`); keep new UI text in Spanish.

## How it works

- `scripts/generate-manifest/` reads the shop's Google Drive folder and writes `arcanist-catalog/src/data/catalog.json`. It runs by hand. Its service account key (`service-account-key.json`) is git-ignored and must never be committed; this repo is public.
- `arcanist-catalog/` is a Next.js 15 site exported as static pages (`output: 'export'`), styled with Tailwind 3.
- `vercel.json` at the repo root builds the site and deploys it on Vercel.
- **[docs/drive-images-schema.md](docs/drive-images-schema.md)** describes the Drive `Images` folder the script reads: folder layout, `meta.txt` format, tag and naming conventions, and the 2026-10-09 reorganization. Read it before changing the script or the Drive data.
- `PLAN.md` (Spanish) has the original implementation plan; `README.md` explains how to regenerate the catalog.

## Do not break: /forge

`www.arcanistsdice.com/forge/` serves **D4 Stat Forge**, a separate app (repo `robazan10/d4-stat-forge`, its own Vercel project). The `redirects` and `rewrites` for `/forge` in `vercel.json` forward those requests. Keep them, and never add a page or file under `/forge` in this site.

## UI and brand

The site is being redesigned to follow the **Arcanist's Dice brand guide**. D4 Stat Forge already uses it, so it's the reference implementation. Before any UI work, read **[docs/brand-ui.md](docs/brand-ui.md)**: palette and roles, fonts and their licenses, logo files, component patterns, and Tailwind tokens.

Key rules:
- Follow the brand guide, not the current site. The current colors (`#3D35B5`, `#40E0C8`, `#0F0D2E`...) are older shades that are being replaced.
- Chinese Rocks can't be served as a web font under its license. See the font section in `docs/brand-ui.md`.
- Mobile first: most visitors come from Instagram and WhatsApp on their phones.

## Workflow

- The owner reviews every change before it's committed. Show what changed, then commit only when asked.
- Work on a branch, push, and open a PR. The owner merges it; never merge or enable auto-merge.
- Commits are authored as Rodrigo Bazan <ro.bazan10@gmail.com> (already set for this repo).
- After a change that affects what visitors see, check it in the browser at phone width before calling it done.
