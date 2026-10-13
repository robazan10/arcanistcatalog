# Decisions

A dated log of decisions that shaped the catalog: what was decided, why, and what else was considered. Add an entry in the same change whenever a decision affects the architecture, roadmap, rules or conventions. Newest last.

## 2026-10-08 · D4 Stat Forge at /forge (#1)

**`/forge` is forwarded to the D4 Stat Forge Vercel project** through `redirects` and `rewrites` in `vercel.json`. This site never adds a page or file under `/forge`.
- Why: both apps share the www.arcanistsdice.com domain while staying separate repos and Vercel projects.

## 2026-10-09 · Redesign (#3)

**Follow the Arcanist's Dice brand guide, not the old site.** Palette, Staatliches + Nunito, logos and component patterns as in [`brand-ui.md`](brand-ui.md); D4 Stat Forge is the reference implementation.

**Chinese Rocks is not served as a web font.** Its Typodermic desktop license forbids distributing the font file, which a website does. Headings use Staatliches (open license). The `.otf`/`.ttf` files were deleted from `public/`.
- **The git history was left as it is**, so the files are still in commit `2a28cc6`. The owner will either buy a web license or rewrite the history later.
- Alternatives: rewrite the history now (force-push on a public repo); buy the license first.

**One WhatsApp button: a gradient bar at the bottom** ("Escríbenos por WhatsApp"), with the WhatsApp logo in its own green (#25D366) on a small indigo circle so it stays legible on the mint end of the gradient. Instagram moved to a button in the header.
- Alternatives: keep the two colored circles (WhatsApp green, Instagram gradient); a green WhatsApp button outside the brand palette.

**The copy keeps saying "dados artesanales"** even though today's products are figures: the catalog will grow to dice, keycaps and more.

**Product view is a bottom sheet on phones** with swipeable photos; a centered window with arrows on desktop.

## 2026-10-09 · Images and data (#5, #6)

**Photos are requested resized by Google** (`…/d/<id>=w500` on cards, `=w1000` in the viewer, `=w200` in list rows). Measured: the first photo of each product went from 2.9 MB to 0.38 MB.
- Why: the site already loaded only one photo per product first; the cost was full-size files.
- Risk: `=w` is undocumented. Fallback if it breaks: the script makes thumbnails and the site serves them.

**The cover photo is the image named `cover` / `Cover`** (any extension) in each product folder. The rest follow in natural name order (`_01`, `_02` … `_10`).
- Why: Drive's listing order is arbitrary; the owner chose a file name over a `meta.txt` key.

**The grid gets only cover, photo count and tags; each product's photo list is a static file** (`/data/products/<id>.json`) fetched when the product opens.
- Why: 355 products with 1,734 photos would make the home page heavy. Home is ~58 KB gzipped.
- Alternatives: all photo URLs inline (simpler, heavier); IDs only.

**Product ID is the slug of brand + name** (`tanuki-nezuko`).
- Why: "Nezuko" and "Death - Puss in Boots" exist in both NomNom and Tanuki.

**Products without photos are shown, not hidden,** as "Fotos pronto": striped card with the faded book symbol, listed after products with photos, and a banner in the product view that keeps the WhatsApp button.
- Alternatives: skip them in the script.

**The product view shows 5 tags plus a "+N" button,** and a "3 / 24" counter instead of dots above 8 photos. Search still matches every tag.
- Why: every product has more than 5 tags (median 19); 103 products have more than 8 photos (max 31).

**Products are sorted A→Z by name on the site** (accent and case insensitive), "Fotos pronto" last.
- Why: Drive returned folders Z→A, which means nothing to visitors.
- Alternatives: newest first.

**The script writes `docs/catalog-status.md` on every run:** products without photos, without a cover, and skipped folders.
- Why: the owner wanted a list of characters without images that stays current.

**Folders without `meta.txt` (myAnimate, Keycaps) stay skipped** until the Drive structure is adjusted.

**The category "Nomnom" was fixed to "NomNom" in Drive**, not patched in code.

## 2026-10-09 · Tag search (#7)

**Tapping a tag searches the whole catalog for it:** the product view closes, the chips reset to Todos, and the tag goes in the search box.

**The search lives in the address (`?q=`).** Typing replaces the history entry; a tag tap adds one, so Back returns to where you were. Shared links open with the search.

**Search ignores accents and case** ("tamano" finds "tamaño").

**Card names wrap to two lines** instead of being cut to one (many NomNom names include the series).

## 2026-10-10 · List view (#8)

**Grid is the default; list is optional,** and the choice is remembered on the visitor's device (`localStorage`). It's not in the address.
- Why: photos sell the pieces; the list fits ~7 products per screen instead of ~3.

**List rows show only model-type tags** (`chibi`, `toon`, `extra`, `bust`, `fullsize`, `diorama`), both when a merged folder has two ("fullsize · bust").
- Why: the literal first tag repeated the product name for 156 of 355 products; 159 products have a model type.
- Alternatives: the literal first tag (the owner's first idea, changed after seeing the data).

## 2026-10-10 · Spanish and English (#9)

**Phase 5 (languages) was done before phase 4 (side menu)** at the owner's request, because phase 4 waits on the Drive reorganization.

**Spanish stays at `/`, English is at `/en/`,** with `hreflang` links and per-language descriptions. No automatic redirect by browser language: a visitor from Instagram lands on the exact link they tapped.

**Every UI text lives in `src/i18n/dictionaries.ts`** in both languages, never hard-coded in a component.

**English visitors send English WhatsApp messages** ("Hi! I'm interested in: …"). The owner is fine receiving both languages.

**Product names, brands and tags are not translated,** and there's no `name_en=` in `meta.txt` (the owner sees no need). Tags are already bilingual, so search works in both languages.

**The English wording from the mockup was accepted for now.**

**`trailingSlash: true` in `next.config.ts`** writes `/en/` as `en/index.html`, which Vercel serves as is.
- Alternatives: `cleanUrls` in `vercel.json` (avoided to keep `vercel.json` limited to the `/forge` rules).

## 2026-10-12 · Handoff docs

**The repo carries the handoff docs** (`docs/README.md`, `roadmap.md`, `decisions.md`, `architecture.md`, `development-rules.md`, `ui.md`) and the agreed mockups in `docs/mockups/`, following the owner's general instructions: another chat or machine must be able to continue from the repo alone. Same structure as the boardgame-scoring repo.
