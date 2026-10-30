# Arcanist's Dice

Static product catalog for **Arcanist's Dice** (El Salvador): hand-painted resin dice and accessories, shown without prices. Visitors contact the shop through WhatsApp and Instagram.

Live at https://www.arcanistsdice.com. The site is in **Spanish** at `/` and **English** at `/en/`. Every UI text lives in `arcanist-catalog/src/i18n/dictionaries.ts`; add new text there in both languages, never hard-coded in a component. Product names, brands and tags come from Drive as they are (tags are already bilingual).

## Start here

**Read "Next up / how to resume" in [docs/roadmap.md](docs/roadmap.md) first.** [docs/README.md](docs/README.md) indexes the rest: decisions, architecture, development rules and setup, the screen guide and the agreed mockups. Every PR keeps them current (checklist in `docs/development-rules.md`).

## How it works

- `scripts/generate-manifest/` reads the shop's Google Drive folder and writes `arcanist-catalog/src/data/catalog.json` and `docs/catalog-status.md` (products without photos or cover, skipped folders). It reads `Images/<NN Type>/<Brand>/<Product>/` and runs by hand. **Ask the owner before each run:** it makes every listed photo public in Drive. `node index.js --dry-run` changes nothing and writes to a temp folder; use it first.
- Its service account key (`service-account-key.json`) is git-ignored and must never be committed; this repo is public. Where to get it: setup steps in `docs/development-rules.md`.
- `arcanist-catalog/` is a Next.js 15 site exported as static pages (`output: 'export'`, `trailingSlash: true`), styled with Tailwind 3. Photos stay in Drive; the site asks Google for resized copies (`=w500`, `=w1000`, `=w200`).
- Usage analytics: Umami Cloud, counting only on the live domain. Every event goes through `track()` in `src/lib/analytics.ts`; **[docs/analytics.md](docs/analytics.md)** lists what is counted. Update it whenever an event changes.
- `vercel.json` at the repo root builds the site and deploys it on Vercel. If a production deploy fails but the build passes on a fresh clone, the owner redeploys from the Vercel dashboard.
- **[docs/drive-images-schema.md](docs/drive-images-schema.md)** describes the Drive `Images` folder the script reads. Read it before changing the script or the Drive data. Cover photos are the images named `cover`/`Cover`.
- `README.md` explains how to regenerate the catalog and run the site. `PLAN.md` is the original May 2026 plan, kept for history.

## Do not break: /forge

`www.arcanistsdice.com/forge/` serves **D4 Stat Forge**, a separate app (repo `robazan10/d4-stat-forge`, its own Vercel project). The `redirects` and `rewrites` for `/forge` in `vercel.json` forward those requests. Keep them, and never add a page or file under `/forge` in this site.

## UI and brand

The site follows the **Arcanist's Dice brand guide** (redesign done in PR #3; D4 Stat Forge uses the same guide). Before any UI work, read **[docs/brand-ui.md](docs/brand-ui.md)** (palette, fonts and licenses, logos, component patterns, Tailwind tokens) and **[docs/ui.md](docs/ui.md)** (the screens as built).

Key rules:
- Use the brand tokens only; the old colors (`#3D35B5`, `#40E0C8`, `#0F0D2E`...) are gone and must not come back.
- Chinese Rocks can't be served as a web font under its license. Its old files are still in git history (commit `2a28cc6`); the owner decides between a web license and a history rewrite.
- Mobile first: most visitors come from Instagram and WhatsApp on their phones. UI changes start with a phone mockup, saved in `docs/mockups/`.

## Workflow

- Nothing changes without the owner's approval: before editing files, switching branches, committing, pushing or opening a PR, show what will be done and wait. Read-only checks are fine.
- Before every commit, show the files, the full commit message and the PR title and description. The PR description has a "Docs updated:" line (commit messages don't repeat it).
- Work on a branch, push, and open a PR. The owner merges it; never merge or enable auto-merge.
- Commits are authored as Rodrigo Bazan <ro.bazan10@gmail.com> (already set for this repo).
- After a change that affects what visitors see, check it in the browser at phone width (390px), in both languages, before calling it done.
