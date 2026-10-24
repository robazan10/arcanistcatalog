# Screen guide

The site is one catalog page in two languages (`/` and `/en/`), designed for phones first (most visitors come from Instagram and WhatsApp). Visual rules come from [`brand-ui.md`](brand-ui.md); texts come from `src/i18n/dictionaries.ts`. Every screen below was checked at 390px.

## UX principles

The ideas behind every screen. Each one comes from a decision in [`decisions.md`](decisions.md) (date in brackets); follow them in new work, and record a decision when one changes.

- **Mobile first.** Most visitors arrive from Instagram and WhatsApp on a phone. Design at 390px first, and check at an iPhone's visible size in Safari (390 × 664): the first screen must show products, not just the brand (2026-10-14).
- **Photos sell the pieces.** The grid with big covers is the default; the list is an option for scanning many products. The owner picks each product's cover in Drive (2026-10-09, 2026-10-10).
- **One main action: WhatsApp.** There are no prices or cart; sales happen in a WhatsApp chat. The gradient WhatsApp button is always within reach, and in a product view its message already names the product. Instagram is secondary (2026-10-09).
- **Fast on phone data.** Photos come resized from Google, the grid loads lazily, and a product's full photo list loads only when it opens (2026-10-09).
- **Find things fast, in any language.** Search ignores accents and case and lives in the address; tags are tappable searches; chips filter by category (2026-10-09).
- **Honest about what's missing.** Products without photos stay visible as "Fotos pronto", with the WhatsApp button, instead of being hidden (2026-10-09).
- **Same experience in Spanish and English.** Every text exists in both; no automatic redirect, so a shared link opens exactly what was shared (2026-10-10).
- **One brand, one visual language** with D4 Stat Forge: the patterns in [`brand-ui.md`](brand-ui.md), with no one-off styles (2026-10-09).
- **Accessible by default.** Visible mint focus outline, labels for screen readers in both languages, no information by color alone, and respect for reduced motion.
- **Mockup before building.** UI changes start with a phone mockup the owner approves, saved in [`mockups/`](mockups/).

## Page, top to bottom

1. **Header** (sticky): the **menu button** (☰, 36px; a mint dot when a type is selected), white book symbol, "Arcanist's Dice" in Staatliches, a lavender tagline (cut with "…" on phones), then the **ES | EN** pill (current language in the gradient; switching keeps `?q=` and `?type=`) and an Instagram button. On phones the symbol is 32px, the name 20px and the gaps 10px so everything fits at 390px. With an old catalog without types there's no menu button.
2. **Top section:** the full dark-background logo, the title in Staatliches with the gradient fill, and a short subtitle. On "Todo" the title is "Catálogo" / "Catalog"; inside a type it's the type's name ("Figuras", "Keycaps", "Dados") with its own line.
   - **Phones (under 640px):** a compact row: the logo at 64px on the left, the 32px title and the subtitle beside it, aligned left. At an iPhone's visible size in Safari (390 × 664) the products start at 369px, so the first row's photos and names show above the WhatsApp bar.
   - **640px and wider:** the big centered logo (150px) with the 48px title and the subtitle below.
3. **Search box:** `field` background, search icon, mint border on focus. Typing filters instantly and updates `?q=`; accents and case are ignored.
4. **Category chips:** pills that scroll sideways. "Todos"/"All" plus one per brand with products in the selected type, each with its count there; on "Todo" all brands in menu order of their type (Tanuki, NomNom, Hiko). The selected one has the gradient. The search also looks only inside the selected type ("Buscar en Keycaps...").
5. **Count and view toggle:** "355 productos" ("… encontrados" while filtering) on the left; on the right two icon buttons, Cuadrícula/Grid and Lista/List, the selected one in the gradient.
6. **Products:** grid or list (below).
7. **Footer:** name and year, a one-line description; extra bottom padding so the WhatsApp bar never covers it.
8. **WhatsApp bar** (fixed): the gradient main button "Escríbenos por WhatsApp" / "Message us on WhatsApp", WhatsApp logo in green on an indigo circle. Full width on phones, bottom-right on desktop. Opens WhatsApp with a greeting in the page's language.

## Side menu by type

- The menu button opens a panel from the left (300px, at most 85% of the screen) over a darkened page: the book symbol and "Productos" / "Products", a × button, then **Todo** and each type with an icon (grid, figure, keycap, die) and its count. The selected one is mint.
- Types come from the Drive type folders in their number order. Empty types are hidden, except **Dados**, which shows a mint "Pronto" / "Soon" badge instead of a count.
- Choosing a type puts it in the address (`?type=keycaps`), clears the search, scrolls to the top and closes the panel. Back/Forward move between types.
- Closes with ×, a tap outside or Escape; focus starts on × and stays in the panel; the page behind doesn't scroll; focus returns to the menu button. The slide-in is skipped with reduced motion.
- **Tapping a tag** in a product view searches the whole catalog (it leaves the selected type).

## Dados: "Próximamente"

A type in the menu with no products (today Dados) shows, under the title, a panel with the striped art and a "Próximamente" badge, "Estamos preparando esta sección", an invitation to ask about custom dice, and buttons to the types that have products ("Ver Figuras", "Ver Keycaps"). No search, chips or count. The WhatsApp bar's message becomes "Hola! Me interesan sus dados personalizados."

## Products: grid (default)

- 2 columns on phones, up to 5 on desktop; cards alternate lighter and darker in a checkerboard.
- **Card:** square cover (`=w500`), photo-count pill when there's more than one photo, name in Staatliches on up to 2 lines, category badge (violet). Border turns mint on hover.
- **"Fotos pronto" card:** striped indigo square with the faded book symbol and a mint "Fotos pronto" / "Photos coming soon" badge. These cards come after all products with photos.
- Order: A→Z by name.

## Products: list

- One column on phones, two on wide screens; rows alternate lighter and darker.
- **Row:** 64px cover (`=w200`) or striped thumbnail, name on up to 2 lines, category badge, the **model type** when the product has one (chibi, toon, extra, bust, fullsize, diorama; "fullsize · bust" for merged folders), photo count or "Fotos pronto", and an arrow.
- The choice of grid or list is remembered on the device.

## Product view

- **Phone:** a bottom sheet with a grab handle. **Desktop:** a centered window with the photo on the left and the info on the right, plus arrow buttons.
- **Photos:** swipe sideways (scroll snap); the cover shows immediately, the rest load on open (`=w1000`). With more than one photo:
  - **Thumbnail row** under the photo with every photo (58px, `=w200`); it scrolls sideways (a thin scrollbar from 768px up), the current one has a mint border and stays centered as the photo changes. Tapping one shows it.
  - **"▦ 19 fotos" / "19 photos" button** (mint outline) at the bottom right of the photo opens the **photo grid**: all the photos in 3 columns on phones, 6 on desktop (`=w300`), inside the product view, with "←" (back to the photo), the name, "19 fotos · toca una para verla en grande", × and, on phones, the WhatsApp button at the bottom. The current photo has a mint border; tapping one returns to it. Escape in the grid goes back to the photo.
- **Info:** name in Staatliches, category badge, "Marca"/"Brand" line only when the brand differs from the category, the first 5 tags as buttons plus a mint "+N" button that shows the rest. **Tapping a tag** closes the view and searches the catalog for it.
- **Actions:** "Consultar este producto" / "Ask about this product" (gradient, WhatsApp with the product name) and "Ver en Instagram" / "See on Instagram" (secondary).
- **No photos:** a shorter striped banner with "Fotos pronto" and a short message instead of the gallery; the actions stay.
- Close with the × button, Escape, or tapping outside. Focus moves to Cerrar/Close; the page behind doesn't scroll.

## Empty results

A die emoji, "No se encontraron productos" / "No products found", and a hint to try other words.

## Mockups

The agreed phone mockups are in [`mockups/`](mockups/). Open them in a browser from the repo (they load the logos from `arcanist-catalog/public/brand/` and photos from Google). They're the designs as agreed, so a few details differ from what was built afterwards:

| Mockup | Agreed | Differences in the built site |
|---|---|---|
| [`2026-10-09-redesign-home-and-card.html`](mockups/2026-10-09-redesign-home-and-card.html) | Home, product card, product view | Subtitle kept the original copy; WhatsApp logo later made green on an indigo circle |
| [`2026-10-09-photos-coming-soon.html`](mockups/2026-10-09-photos-coming-soon.html) | "Fotos pronto" card and banner, "3 / 24" counter, "+N" tags | Panel 3 uses a stand-in photo |
| [`2026-10-10-list-view.html`](mockups/2026-10-10-list-view.html) | Grid/list toggle and list rows | Rows also show the model type, added after the mockup |
| [`2026-10-10-languages.html`](mockups/2026-10-10-languages.html) | ES \| EN switch, English page and product view | None |
| [`2026-10-14-compact-top.html`](mockups/2026-10-14-compact-top.html) | Compact top section on phones: today vs options A, B, C at 390 × 664; B chosen | Logo at 64px instead of the mockup's 54px; the real page has a little more spacing, so products start at 369px instead of 337px |
| [`2026-10-24-all-photos.html`](mockups/2026-10-24-all-photos.html) | All of a product's photos: options A–D, then A + B chosen (thumbnail row + "19 fotos" grid), phone and desktop | The grid doesn't mark the cover with "Portada" |
| [`2026-10-23-type-menu.html`](mockups/2026-10-23-type-menu.html) | Phase 4: menu button, side panel by type, title per type, Dados "Próximamente", English | Header on phones: symbol 32px and name 20px (the mockup's 40px and 22px didn't fit with the menu button) |
