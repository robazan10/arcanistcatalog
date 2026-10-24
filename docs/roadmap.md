# Roadmap

What's done, what's next, and how to pick the work up. Decisions behind each step are in [`decisions.md`](decisions.md).

## Next up / how to resume (2026-10-24)

- **State:** `main` has everything through PR #20 and is live at www.arcanistsdice.com: phase 4 (side menu by type, Dados "Próximamente") and the 67 keycap series. PR #21 added the first photos of 11 keycap series. Work in progress: `feat/all-photos` (product view: a row with every photo's thumbnail and a "19 fotos" button that opens a grid of all the photos; mockup `2026-10-24-all-photos.html`; built and checked at 390px and desktop in both languages).
- **Drive reorganized on 2026-10-21** (by Claude Code, verified against Drive's server): `01 Figures/` (NomNom, Tanuki, myAnimate), `02 Keycaps/Hiko/`, `03 Dice/` and `04 Others/` empty. Details in [`drive-images-schema.md`](drive-images-schema.md). The old `Images/Keycaps/` folder is a leftover for the owner to delete.
- **Keycap series rebuilt on 2026-10-22** (by Claude Code, owner's approval): `02 Keycaps/Hiko/` has 67 series folders, one per franchise or Hiko theme the owner has models for, each with only a `meta.txt` (tags from the model file names). The earlier 32 series and their 85 photos moved to `3D Arcanist/Keycaps archive/Hiko/`, outside `Images/`.
- **Next step:** the owner merges the `feat/all-photos` PR, then check a product with many photos (Pokemon, 56) on the live site. After that, phase 6 (below). A real run takes 12–14 minutes (it confirms sharing on every photo).
- **The owner's remaining Drive work** (in parallel):
  1. Delete the leftover `Images/Keycaps/` folder.
  2. Keycap photos for the other 56 series, and a `Cover` for every series (the 11 with photos have none yet, so each shows its first photo by file name); anything for `03 Dice/` and `04 Others/`.
  3. `meta.txt` for the myAnimate folders (Claude Code can draft them for review), covers, and figure photos (147 figures without any, 202 without a `Cover`; lists in [`catalog-status.md`](catalog-status.md)).
- **Then, in order:**
  1. Phase 6, usage analytics and sharing (scope below): mockup of the share buttons first, then build.
- **Decisions waiting on the owner:**
  - Phase 6: create the Umami Cloud account and share the site ID (not a secret).
  - Chinese Rocks in the git history: buy a Typodermic web license or rewrite the history (see the backlog).
  - The English wording was accepted "for now"; review it in `arcanist-catalog/src/i18n/dictionaries.ts` whenever convenient.

## Status

| Phase | What | Status |
|---|---|---|
| Redesign | Brand guide applied: palette, Staatliches + Nunito, logos, cards, product view, WhatsApp bar | Done (#3) |
| 1 · Images | Google-resized photos, cover photo first, per-product photo files, "Fotos pronto", brand+name IDs, full catalog | Done (#5, #6) |
| 2 · Tag search | Tap a tag to search, search in the address (`?q=`), accent-insensitive, two-line names | Done (#7) |
| 3 · Grid / list | View toggle, list rows with model type, choice remembered on the device | Done (#8) |
| 5 · Spanish and English | `/` Spanish, `/en/` English, ES \| EN switch, all texts in one dictionary | Done (#9). Done before phase 4 at the owner's request |
| Compact top on phones | Logo 64px beside the title on phones; big logo kept on desktop | Done (#11) |
| 4 · Side menu by type | Menu button and side panel by type, title per type, Dados "Próximamente", `?type=` | Done (#20) |
| 6 · Usage analytics and sharing | Umami events (views, WhatsApp clicks per product, searches…), `?p=` product links, share buttons | Planned, after phase 4 |

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
| [#10](https://github.com/robazan10/arcanistcatalog/pull/10) | 2026-10-13 | Handoff docs (`docs/README.md`, roadmap, decisions, architecture, development rules, screen guide) and the saved mockups |
| [#11](https://github.com/robazan10/arcanistcatalog/pull/11) | 2026-10-15 | Compact top section on phones (logo 64px beside the title); big logo kept from 640px up |
| [#12](https://github.com/robazan10/arcanistcatalog/pull/12) | 2026-10-15 | Roadmap: agreed order (Drive work, phase 4, phase 6) and the phase 6 scope |
| [#13](https://github.com/robazan10/arcanistcatalog/pull/13) | 2026-10-16 | UX principles in `ui.md`; `brand-ui.md` brought up to date |
| [#14](https://github.com/robazan10/arcanistcatalog/pull/14) | 2026-10-18 | Selected category chip: gradient runs edge to edge (no mint strip on the right) |
| [#15](https://github.com/robazan10/arcanistcatalog/pull/15) | 2026-10-21 | Target Drive structure for phase 4 (type → brand → product, English type folders) |
| [#16](https://github.com/robazan10/arcanistcatalog/pull/16) | 2026-10-21 | Drive reorganized: schema doc, architecture and roadmap describe the new layout and the keycap series |
| [#17](https://github.com/robazan10/arcanistcatalog/pull/17) | 2026-10-21 | Catalog script reads type → brand → product; `type` and `types` in `catalog.json`; `--dry-run` |
| [#18](https://github.com/robazan10/arcanistcatalog/pull/18) | 2026-10-22 | Docs for the keycap series rebuilt in Drive (67 series with `meta.txt`, old photos in `Keycaps archive`) |
| [#19](https://github.com/robazan10/arcanistcatalog/pull/19) | 2026-10-23 | Script renews its login on a 401, stops on `meta.txt` read errors, logs in English, shows the run time |
| [#20](https://github.com/robazan10/arcanistcatalog/pull/20) | 2026-10-23 | Phase 4: menu by type, title per type, Dados "Próximamente", `?type=`; catalog with the 67 keycap series (422 products) |
| [#21](https://github.com/robazan10/arcanistcatalog/pull/21) | 2026-10-24 | Catalog regenerated: first photos for 11 keycap series |
| `feat/all-photos` | open | Product view: thumbnail row with every photo and a grid of all the photos |

## Agreed scope: phase 4 · side menu by type

Agreed on 2026-10-09 and 2026-10-10; Drive structure and type names agreed on 2026-10-21; phone mockup agreed on 2026-10-23: [`mockups/2026-10-23-type-menu.html`](mockups/2026-10-23-type-menu.html).

- **Drive layout:** `Images/<NN Type>/<Brand>/<Product>/`, with the types `01 Figures`, `02 Keycaps`, `03 Dice`, `04 Others` (the structure is in place since 2026-10-21; see [`drive-images-schema.md`](drive-images-schema.md)). The script reads the type from the first level and the brand from the second, so `category=` and `brand=` in `meta.txt` are no longer needed; it warns when they don't match the folders, and when two products get the same ID.
- **Order:** the number prefix on the type folders sets the menu order; the script hides it.
- **Menu:** a menu button (☰, 36px) at the left of the header opens a panel from the left, titled "Productos" / "Products": "Todo" plus each type with an icon (grid, figure, keycap, die) and its count; the selected one in mint. It closes with ×, a tap outside or Escape. A mint dot on the menu button shows a type is selected. Inside a type, the chips filter by brand and the search looks only inside the type; on "Todo" the chips are all brands in type order.
- **Title per type:** the top title becomes the type's name, with its own line (Figuras: "Figuras de anime, series y videojuegos, impresas en resina y pintadas a mano"; Keycaps: "Teclas de anime, series y videojuegos para tu teclado"; Dados: today's line). On "Todo" it stays "Catálogo".
- **Empty types:** Dice shows even when empty, with a mint "Pronto" / "Soon" badge instead of the count; selecting it shows a "Próximamente" notice (striped art, a line inviting a WhatsApp message about custom dice, buttons to Figuras and Keycaps), with no search, chips or count. Others is hidden while empty. Both fill in by themselves once their Drive folder has products.
- **Phones:** with the extra button, the header tagline is cut with "…".
- **Address:** the selected type goes in the URL as `?type=` (for example `/?type=dice`, `/en/?type=dice`) so a section can be linked from Instagram. Switching ES | EN keeps it, like `?q=`.
- **Languages:** Drive type folders are in English; the menu labels and type names go in `src/i18n/dictionaries.ts` in both languages (Figures/Figuras, Keycaps/Keycaps, Dice/Dados, Others/Otros). A type without a translation shows its folder name.
- **Keycaps** is a type: `02 Keycaps/Hiko/<series>/`, one product per series with the characters as tags.
- **First step of the build:** done in `feat/script-three-levels` (the script reads the three levels and writes `types`). Left for the menu itself: the site reading `types`, the menu panel, `?type=`, translations.
- Mockup done (2026-10-23); built on `feat/type-menu` (2026-10-23).

## Agreed scope: phase 6 · usage analytics and sharing

Agreed on 2026-10-15; to start after phase 4. Goal: data to evaluate which products are viewed and asked about most.

- **Tool: Umami Cloud.** The owner creates the account and shares the site ID (not a secret). Before building, check the current free-plan limits and data retention; export the data periodically if retention is short.
- **Code:** one `track(event, data)` function in `src/lib/analytics.ts`, so the tool can be swapped without touching components. The Umami script loads only on the live site (not in local builds or Vercel previews).
- **Events:**

  | Event | Data | Answers |
  |---|---|---|
  | `product_view` | product id, name, brand, category, language | Most viewed products |
  | `whatsapp_click` | product id (or "general"), language | Most asked-about products (closest signal to a sale) |
  | `search` | search text, result count | What people look for; searches with 0 results show demand |
  | `tag_click`, `category_click` | tag or category | Interest by series and brand |
  | `photo_swipe` | product id, photos seen | Engagement with each product's photos |
  | `instagram_click`, `language_switch`, `view_toggle` | — | General behavior |

  No personal data. Umami adds referrer, device and country on its own; the owner adds `utm_source` / `utm_campaign` to links posted on Instagram.
- **Shareable product links:** `?p=<product id>` (for example `/?p=tanuki-gojo`, `/en/?p=tanuki-gojo`) opens that product directly; closing it removes `p` from the address.
- **Share buttons** (UI, mockup first):
  - Next to the results: shares the current search. `?q=` links already work since #7; the button just makes them easy to get.
  - In the product view: shares the product's `?p=` link.
  - On phones the button opens the phone's share menu (Web Share API); on desktop it copies the link. Labels in both languages in the dictionary.
- **First report** after 2–4 weeks of data: products ranked by views and by WhatsApp clicks, and searches with no results.

## Backlog

- **Chinese Rocks in the git history:** the font files were deleted in #3 but are still in commit `2a28cc6` of this public repo. Fix: a Typodermic web license, or a history rewrite + force-push. Owner's decision; don't rewrite history without it.
- **Covers:** 211 products with photos have no `Cover` image (200 figures, 11 keycap series); the card uses the first photo by name, sometimes `Scaleparts.jpg`.
- **Photos:** 147 products show "Fotos pronto".
- **myAnimate (31 folders):** no `meta.txt`, so they're skipped.
- **Keycaps (67 series):** 11 with photos (no covers yet), 56 still "Fotos pronto".
- **English wording:** accepted for now; review when convenient.
- **Vercel CLI:** not installed on the owner's Mac, so build logs need the Vercel dashboard. Optional: install it and log in.
