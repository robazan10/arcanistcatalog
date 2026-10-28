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

## 2026-10-14 · Compact top section on phones

**On phones, the logo shrinks to 64px and sits beside the title and subtitle; tablets and desktop keep the big centered logo.**
- Why: at an iPhone's visible size in Safari (390 × 664), the big logo, title and subtitle took about 45% of the first screen; only 43px of products showed above the WhatsApp bar. Now the products start at 369px (was 545px) and the first row's photos and names are visible.
- 64px instead of the mockup's 54px, so the "Arcanist's Dice" lettering stays readable.
- Alternatives: (A) remove the big logo on phones, since the header already shows the book symbol and the name; most room for products after C. (C) remove the top section on phones, keeping the title only for screen readers and search engines; most room, but loses the title and the description new visitors read. The owner chose B to keep the full logo on the first screen.

**The "Docs updated:" line moves from commit messages to PR descriptions,** following the owner's updated general instructions.

## 2026-10-15 · Order of the next work, and usage analytics

**Order: the owner's Drive work first, then phase 4 (side menu), then phase 6 (analytics and sharing).** Drive gets reorganized by type, the other categories added, photos filled in and covers corrected before more site work.
- Why: phase 4 depends on the new Drive structure, and analytics are more useful once the catalog is complete.
- Alternatives: phase 6 first (it doesn't depend on Drive).

**Usage analytics with Umami Cloud,** through one `track()` function and custom events (product views, WhatsApp clicks per product, searches including those with 0 results, tag and category clicks, photo swipes).
- Why: the site is one page, so page views alone can't say which products are viewed; Umami takes events with details like the product name, uses no cookies (no consent banner on phones), and is free at this traffic.
- Alternatives: PostHog (deeper analysis and SQL, more complex, heavier script); Google Analytics 4 (free, BigQuery export, but complex and cookie-based); Vercel Web Analytics (custom events need a paid plan); an own database (needs a server; the site is static).

**Shareable product links (`?p=`) and share buttons** for a product and for a search.
- Why: a product link can be posted on Instagram on its own, and gives each product its own address. Search links (`?q=`) already worked since #7; the buttons make both easy to get.
- Alternatives: `?p=` links without buttons.

**Phase 6 stays a plan until the Drive updates are done.**

## 2026-10-21 · Drive structure for product types

**`Images/` becomes three levels: type → brand → product** (`Images/01 Figures/Tanuki/Voldemort/`). The type is the side menu; the brand is the chips inside it. `category=` and `brand=` in `meta.txt` become unnecessary.
- Why: the catalog grows beyond figures (keycaps, dice, others), and the folders are the simplest place for the owner to manage it.
- Alternatives: a `type=` key in each `meta.txt` (one more line to keep right in hundreds of files); keeping `category=` as the type.

**Type folders are named in English** (`01 Figures`, `02 Keycaps`, `03 Dice`, `04 Others`), with a number prefix for the menu order. The site translates them through the dictionary.
- Why: the owner prefers English names in Drive.
- Alternatives: Spanish folder names (the earlier plan); no numbers (alphabetical order).

**The shop's own products go under an `Arcanist's Dice` brand folder,** so every product has a brand. **Product IDs stay brand + name**, so they don't change when a product moves between types.

**The type goes in the address as `?type=`** (for example `/?type=dice`), not `?tipo=` as first planned, to match the English type folders.

## 2026-10-21 · Drive reorganized, keycaps by series

**Claude Code did the reorganization through the synced Drive folder,** as moves only, checked against Drive's server.
- Why: Drive keeps a file's ID when it moves, and the live site links photos by ID; verifying every ID before and after made it safe to do in bulk.
- Alternatives: the owner moving folders by hand in Drive.

**Keycaps are one product per series, anime, movie or game** (`02 Keycaps/Hiko/Demon Slayer/`), not one per character. The characters go in `tags=`.
- Why: the owner's preference; fewer cards, and a series card shows all its keycaps.
- Alternatives: one product per character or set (54 folders; the first proposal).

**Volumes stay inside their series** (Dragon Ball Vol I, Vol II and Daima; Chainsaw Man Vol I and II; Pokemon Eeveelutions and Legendaries). **Studio Ghibli is one folder,** because one photo mixes Calcifer (Howl's Moving Castle) and Kaonashi (Spirited Away). Donkey Kong Bananza and Super Mario stay separate, as do Deadpool and Spider-Man.

**`meta.txt` for the keycap series and myAnimate is deferred** until the owner adds the remaining keycap series.

## 2026-10-21 · Catalog script reads type → brand → product

**The script reads `Images/<NN Type>/<Brand>/<Product>/`,** done before the rest of phase 4 at the owner's request. Each product gets a `type`; `catalog.json` gets a `types` list for the future menu. The site doesn't use them yet, so nothing visible changes.

**The category is the brand folder's name, and `meta.txt` only needs `name=`.** Old `category=`/`brand=` lines still work; a mismatch with the folder is a warning and the folder wins.
- Why: the folders already say it; one less line to keep right in every `meta.txt`, and the chips and badges stay exactly as they are.
- Alternatives: keep requiring `category=` (redundant); make `category` the type (would change the chips before the menu exists).

**Two root folders with the same type name merge into one type, with a warning;** a root folder without a number goes last, with a warning.
- Why: the leftover `Images/Keycaps/` would otherwise create a second "Keycaps" type with the same id until the owner deletes it.

**`--dry-run`** reads Drive without changing sharing and writes to a temp folder.
- Why: compare a run with the live catalog before committing to a real run, which changes photo sharing in Drive.

**The README and all code comments are in English,** like the rest of the docs (the owner's preference). The site's visible texts stay in both languages in the dictionary; the catalog script's terminal messages were still in Spanish (translated on 2026-10-22, see below). `PLAN.md` stays in Spanish as the historical May 2026 plan.

## 2026-10-22 · Keycap series rebuilt from the owned models

**`02 Keycaps/Hiko/` has one folder per series the owner has Hiko models for (67),** built from the model files on the Mac (`Desktop/Arcanist's Dice/3D Models/Hiko Keycaps/`), each with only a `meta.txt`.
- Why: the owner wanted the full list of what they can print, ready for photos, instead of only the series that had photos.

**The earlier 32 series and their photos moved to `3D Arcanist/Keycaps archive/Hiko/`,** outside `Images/`, and were recreated empty (the owner's "option B").
- Why: the owner wanted the series folders without images. Outside `Images/` the script doesn't read the archive, so no duplicate products.
- Alternatives: add `meta.txt` to the existing folders and keep their photos (option A); move them into `Images/Keycaps/` (would merge into the Keycaps type and duplicate 32 product IDs).

**Keycap tags list every model in the series, taken from the file names,** then the bilingual and media tags. `meta.txt` also has `category=Hiko` and `brand=Hiko` at the owner's request (the brand folder's name, so no warnings).

**Hiko's own designs are grouped by theme** (Cute Animals, Kitties, Christmas, Halloween, Food…), like franchise series. **League of Legends is its own series** (Teemo, Poros, Kindred), apart from Arcane (Caitlyn, Jinx). Aries goes in `Zodiac Signs`; `Owl Witch` (Hiko's design) and `Mimic Chest` (generic) are their own series.

**`Smile_Keycaps` is left out** (a free set by another designer; owner's choice).

## 2026-10-22 · Catalog script: login renewal and read errors

**The Drive client sets `forceRefreshOnFailure`:** on a 401 it gets a new access token and retries once.
- Why: two dry runs failed about an hour in with `ACCESS_TOKEN_EXPIRED`. The library renews a token before it expires but doesn't retry a refused request by default; a test with a dead token failed without the option and passed with it.
- Alternatives: keep every run under an hour (not under our control on an idle Mac); retry the whole run by hand.

**A `meta.txt` that can't be read stops the run** (nothing is written) instead of skipping the product. Folders without `meta.txt` are still skipped.
- Why: the failed dry run dropped `Spawn - Spawn comics` with only a warning; a real run would have removed it from the live site.

**The script's terminal messages are in English,** like the code and docs (owner's request). The run summary also shows how long it took.

## 2026-10-23 · Phase 4 mockup: menu by type

**The phone mockup [`2026-10-23-type-menu.html`](mockups/2026-10-23-type-menu.html) is agreed:** a menu button left of the header opens a side panel with "Todo" and each type, with icons and counts; the title changes to the type's name with its own line; `?type=` in the address.
- Why: keycaps would otherwise mix with figures under a "Hiko" chip that doesn't say what they are.
- Alternatives: run the catalog now with brand chips only; type chips instead of a panel (the agreed scope since 2026-10-09 is a side panel).

**An empty Dice type is shown as "Próximamente"; an empty Others type is hidden.**
- Why: the shop is called Arcanist's Dice, so visitors look for dice; hiding the section would suggest the shop doesn't make them, and a notice with WhatsApp keeps the contact. "Otros" says nothing while empty.
- Alternatives: hide every empty type (the earlier scope); show both as coming soon (two empty sections out of four feel unfinished).

**Built details** (same day): the selected type lives in `?type=`, and the header menu, the catalog and the WhatsApp bar follow it through one hook; tapping a tag in a product view searches the whole catalog (it leaves the type), so a "goku" tag on a keycap also finds the Goku figures; in Dados the WhatsApp message asks about custom dice; on phones the header symbol and name are a bit smaller so the menu button fits at 390px; the panel renders in `<body>` because the header's backdrop blur traps fixed elements.

## 2026-10-24 · All of a product's photos at a glance

**The product view gets a thumbnail row and a photo grid** (mockup [`2026-10-24-all-photos.html`](mockups/2026-10-24-all-photos.html)), on phones and desktop. Under the big photo, a row with every photo's thumbnail that scrolls sideways; a "▦ 19 fotos" button on the photo (replacing the dots and the "3 / 24" counter) opens a grid of all the photos inside the product view, 3 columns on phones and 6 on desktop. Tapping a photo in the grid goes back to it.
- Why: keycap series have up to 56 photos; one at a time, reaching photo 15 took 14 swipes.
- Alternatives: only the grid (A) or only the row (B); a "Fotos | Cuadrícula" switch inside the view (C: long view, buttons far down); every photo in a vertical list (D: very long, more mobile data). A "Ver 19" box at the end of the row was in the first draft; the owner preferred the row with only photos, since the button on the photo already opens the grid.

## 2026-10-24 · Design review: compact top, type chips, badges

The owner asked for a review of the live site; the agreed changes are on a claude.ai Design canvas (sources and link in [`mockups/2026-10-24-design-review/`](mockups/2026-10-24-design-review/)).

**The top section is a compact row on every screen,** with the full logo kept (64px wide on phones, 90px on desktop) and, from 768px, the search on the same row.
- Why: on desktop the big centered logo pushed the first products to 608px at 1440 × 900; now they start at 305px. The owner wanted the logo kept.
- Alternatives: drop the logo from the top (the first draft); keep the big centered logo.

**On "Todo" the chips are the product types; inside a type they are its brands.** A type with one brand shows no brand chips. This replaces the phase 4 choice of brand chips on "Todo".
- Why: Tanuki, NomNom and Hiko are model designers that visitors don't know; types are what they look for, and the chips show the sections without opening the menu.

**Card and row badges show the type (on "Todo") or the brand (inside a type), plus the model type** in the page's language ("Figura · Busto", "Tanuki · Chibi").
- Why: a brand badge on every card said little; the model type was only in the list view, in English.
- Not built: a series line on the card (no reliable series field in `meta.txt` yet).

**Header and subtitle copy name the whole catalog:** "Figuras, keycaps y dados · El Salvador" (header, from 640px; "El Salvador" on phones, where the longer line was cut) and "Figuras, keycaps y dados impresos en resina y pintados a mano". Dados keeps the old dice line. This updates the 2026-10-09 choice to keep the dice copy, now that figures and keycaps are sections; the footer and the link-preview description are unchanged.

**The header drops the small book symbol** (the full logo is right below), and the menu and Instagram buttons are 44px, a comfortable touch size. **On desktop the WhatsApp button is a smaller round "Escríbenos" pill** so it covers less of the grid; on phones it stays the full-width bar.

**Covers are fixed in Drive, not code:** the canvas has a cover guide (the painted piece, plain background, centered; no grey renders, promo art with text or technical files).

## 2026-10-28 · Sharing (first half of phase 6)

**Products get links (`?p=<id>`), and the product view and the results get a "Compartir" button** (boards Share 1–5 in [`mockups/2026-10-24-design-review/`](mockups/2026-10-24-design-review/)). On phones it opens the phone's share menu; elsewhere it copies the link and shows "Enlace copiado". The results button shares the type and the search, never an open product.
- Why: people send products to friends; a link that opens the product directly is easier to act on.
- How: touch screens (`pointer: coarse`) use the Web Share API; desktop copies, because desktop share menus are uncommon and copying is what people expect there. If copying is blocked, the message shows the link to copy by hand.
- `?p=` is written with `replaceState`, so opening and closing products doesn't add Back steps.

**The Instagram button leaves the product view;** "Compartir" takes its place. It opened the same Instagram page as the header button, so it repeated it.

**The "Consultar este producto" WhatsApp message carries the type and the product link:** "Hola! Me interesa el producto: Demon Slayer (Keycaps)" and the link on the next line.
- Why: the shop sees exactly which product; the type tells apart products with the same name (a Gojo figure and Gojo keycaps).

**Not done:** a link preview per product. A pasted link shows the site's general preview; per-product previews need one small static page per product (a possible follow-up).

**The "Enlace copiado" message sits at the top of the screen,** not at the bottom as drawn on the desktop board: at the bottom it covered the product view's WhatsApp button on phones.
