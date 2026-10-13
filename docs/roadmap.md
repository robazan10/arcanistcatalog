# Roadmap

What's done, what's next, and how to pick the work up. Decisions behind each step are in [`decisions.md`](decisions.md).

## Next up / how to resume (2026-10-12)

- **State:** `main` has everything through PR #9 and is live at www.arcanistsdice.com (`/`, `/en/` and `/forge` checked on 2026-10-12). No feature branch is open. This docs PR (`docs/handoff`) is the only work in progress.
- **Next step:** phase 4, the side menu by product type. It can't start until the owner:
  1. reorganizes Drive into one folder per type (see the agreed scope below), and
  2. sends the menu names and their order.
  Then: phone mockup first, then build.
- **Decisions waiting on the owner:**
  - Phase 4 menu names and order (above).
  - Chinese Rocks in the git history: buy a Typodermic web license or rewrite the history (see the backlog).
  - The English wording was accepted "for now"; review it in `arcanist-catalog/src/i18n/dictionaries.ts` whenever convenient.
- **Data work for the owner in Drive** (lists in [`catalog-status.md`](catalog-status.md)): photos for 147 products, a `Cover` image for 202, `meta.txt` for the myAnimate and Keycaps folders. After changes, rerun the catalog script (ask the owner first, see [`development-rules.md`](development-rules.md)).

## Status

| Phase | What | Status |
|---|---|---|
| Redesign | Brand guide applied: palette, Staatliches + Nunito, logos, cards, product view, WhatsApp bar | Done (#3) |
| 1 · Images | Google-resized photos, cover photo first, per-product photo files, "Fotos pronto", brand+name IDs, full catalog | Done (#5, #6) |
| 2 · Tag search | Tap a tag to search, search in the address (`?q=`), accent-insensitive, two-line names | Done (#7) |
| 3 · Grid / list | View toggle, list rows with model type, choice remembered on the device | Done (#8) |
| 5 · Spanish and English | `/` Spanish, `/en/` English, ES \| EN switch, all texts in one dictionary | Done (#9). Done before phase 4 at the owner's request |
| 4 · Side menu by type | Menu of product types (Figuras, Dados, Keycaps, Deckboxes…) | Waiting on the owner (Drive reorganization + names and order) |

## Pull requests

| PR | Merged | What |
|---|---|---|
| [#1](https://github.com/robazan10/arcanistcatalog/pull/1) | 2026-10-08 | Serve D4 Stat Forge at `/forge` (`vercel.json` redirects and rewrites) |
| [#2](https://github.com/robazan10/arcanistcatalog/pull/2) | 2026-10-09 | `CLAUDE.md` and `docs/brand-ui.md` |
| [#3](https://github.com/robazan10/arcanistcatalog/pull/3) | 2026-10-09 | Redesign with the brand guide; Chinese Rocks files removed |
| [#4](https://github.com/robazan10/arcanistcatalog/pull/4) | 2026-10-09 | `docs/drive-images-schema.md` |
| [#5](https://github.com/robazan10/arcanistcatalog/pull/5) | 2026-10-09 | Images phase: resized photos, cover first, per-product JSON, "Fotos pronto", brand+name IDs, 5 tags + "+N", photo counter |
| [#6](https://github.com/robazan10/arcanistcatalog/pull/6) | 2026-10-09 | Catalog regenerated from the reorganized Drive (355 products); A→Z order; `catalog-status.md` |
| [#7](https://github.com/robazan10/arcanistcatalog/pull/7) | 2026-10-09 | Tag search, `?q=`, accent-insensitive search, two-line card names |
| [#8](https://github.com/robazan10/arcanistcatalog/pull/8) | 2026-10-10 | List view and grid/list toggle |
| [#9](https://github.com/robazan10/arcanistcatalog/pull/9) | 2026-10-10 | Spanish and English |
| `docs/handoff` | open | These handoff docs and the saved mockups |

## Agreed scope: phase 4 · side menu by type

Agreed on 2026-10-09 and 2026-10-10; names and order still to come from the owner.

- **Drive layout:** one folder per type above the brands: `Images/<Type>/<Brand>/<Product>/` (for example `Images/Figuras/Tanuki/Voldemort/`). The script reads the type from the top folder, so `category=` in `meta.txt` is no longer needed for it. This adds a level to the two-level layout in [`drive-images-schema.md`](drive-images-schema.md); update that doc with the change.
- **Order:** optionally number the type folders (`01 Figuras`, `02 Dados`) and have the script hide the number, so the owner controls the order from Drive.
- **Menu:** a menu button at the left of the header opens a panel from the left: "Todo" plus each type with its count; the selected one in mint. Inside a type, the chips filter by brand. Types with no products are hidden.
- **Address:** the selected type goes in the URL (`?tipo=dados`) so a section can be linked from Instagram.
- **Languages:** menu labels and type names go in `src/i18n/dictionaries.ts` in both languages; Drive folder names stay in Spanish.
- **Keycaps** currently sits next to the brands in Drive; it becomes a type in this layout.
- Mockup first, then build.

## Backlog

- **Chinese Rocks in the git history:** the font files were deleted in #3 but are still in commit `2a28cc6` of this public repo. Fix: a Typodermic web license, or a history rewrite + force-push. Owner's decision; don't rewrite history without it.
- **Covers:** 202 products with photos have no `Cover` image; the card uses the first photo by name, sometimes `Scaleparts.jpg`.
- **Photos:** 147 products show "Fotos pronto".
- **myAnimate (31 folders) and Keycaps (1):** no `meta.txt`, so they're skipped.
- **English wording:** accepted for now; review when convenient.
- **Vercel CLI:** not installed on the owner's Mac, so build logs need the Vercel dashboard. Optional: install it and log in.
