# Roadmap

What's done, what's next, and how to pick the work up. Decisions behind each step are in [`decisions.md`](decisions.md).

## Next up / how to resume (2026-10-21)

- **State:** `main` has everything through PR #15 and is live at www.arcanistsdice.com. Apart from this docs update (`docs/drive-reorganized`), no branch is open.
- **Drive reorganized on 2026-10-21** (by Claude Code, verified against Drive's server): `01 Figures/` (NomNom, Tanuki, myAnimate), `02 Keycaps/Hiko/` (32 series, one product per series), `03 Dice/` and `04 Others/` empty. Details in [`drive-images-schema.md`](drive-images-schema.md). The old `Images/Keycaps/` folder is a leftover for the owner to delete.
- **Next step: the owner's remaining Drive work.** Nothing to build until it's done:
  1. Add the missing keycap series from Hiko's unsorted models (one folder per series under `02 Keycaps/Hiko/`), and anything for `03 Dice/` and `04 Others/`.
  2. Then `meta.txt` for the myAnimate folders and every keycap series (Claude Code can draft them for review: series as the name, characters and bilingual tags), covers, and photos (147 figures without any, 202 without a `Cover`; lists in [`catalog-status.md`](catalog-status.md)). Deferred by the owner until the keycap series are complete.
- **Then, in order:**
  1. Update the catalog script for the new type level (part of phase 4), then rerun it (ask the owner first, see [`development-rules.md`](development-rules.md)). **Don't run the current script after the Drive reorganization:** it would read the type folders as brands and the brand folders as products, and skip almost every product. The live site is unaffected until a new `catalog.json` is committed.
  2. Phase 4, the side menu by type: phone mockup first, then build.
  3. Phase 6, usage analytics and sharing (scope below): mockup of the share buttons first, then build.
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
| 4 · Side menu by type | Menu of product types (Figuras, Dados, Keycaps, Deckboxes…) | Waiting on the owner (Drive reorganization + names and order) |
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
| `docs/drive-reorganized` | open | Drive reorganized: schema doc, architecture and roadmap describe the new layout and the keycap series |

## Agreed scope: phase 4 · side menu by type

Agreed on 2026-10-09 and 2026-10-10; Drive structure and type names agreed on 2026-10-21.

- **Drive layout:** `Images/<NN Type>/<Brand>/<Product>/`, with the types `01 Figures`, `02 Keycaps`, `03 Dice`, `04 Others` (the structure is in place since 2026-10-21; see [`drive-images-schema.md`](drive-images-schema.md)). The script reads the type from the first level and the brand from the second, so `category=` and `brand=` in `meta.txt` are no longer needed; it warns when they don't match the folders, and when two products get the same ID.
- **Order:** the number prefix on the type folders sets the menu order; the script hides it.
- **Menu:** a menu button at the left of the header opens a panel from the left: "Todo" plus each type with its count; the selected one in mint. Inside a type, the chips filter by brand. Types with no products are hidden.
- **Address:** the selected type goes in the URL as `?type=` (for example `/?type=dice`, `/en/?type=dice`) so a section can be linked from Instagram.
- **Languages:** Drive type folders are in English; the menu labels and type names go in `src/i18n/dictionaries.ts` in both languages (Figures/Figuras, Keycaps/Keycaps, Dice/Dados, Others/Otros). A type without a translation shows its folder name.
- **Keycaps** is a type: `02 Keycaps/Hiko/<series>/`, one product per series with the characters as tags.
- **First step of the build:** update the script for the three levels, and mark in `drive-images-schema.md` that the script reads them.
- Mockup first, then build.

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
- **Covers:** 202 products with photos have no `Cover` image; the card uses the first photo by name, sometimes `Scaleparts.jpg`.
- **Photos:** 147 products show "Fotos pronto".
- **myAnimate (31 folders) and Keycaps (1):** no `meta.txt`, so they're skipped.
- **English wording:** accepted for now; review when convenient.
- **Vercel CLI:** not installed on the owner's Mac, so build logs need the Vercel dashboard. Optional: install it and log in.
