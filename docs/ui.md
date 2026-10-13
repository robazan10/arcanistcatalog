# Screen guide

The site is one catalog page in two languages (`/` and `/en/`), designed for phones first (most visitors come from Instagram and WhatsApp). Visual rules come from [`brand-ui.md`](brand-ui.md); texts come from `src/i18n/dictionaries.ts`. Every screen below was checked at 390px.

## Page, top to bottom

1. **Header** (sticky): white book symbol, "Arcanist's Dice" in Staatliches, a lavender tagline, then the **ES | EN** pill (current language in the gradient; switching keeps `?q=`) and an Instagram button.
2. **Top section:** the full dark-background logo, the title ("Catálogo" / "Catalog") in Staatliches with the gradient fill, and a one-line subtitle.
3. **Search box:** `field` background, search icon, mint border on focus. Typing filters instantly and updates `?q=`; accents and case are ignored.
4. **Category chips:** pills that scroll sideways. "Todos"/"All" plus one per category (today the brands, Tanuki and NomNom), each with its count; the selected one has the gradient.
5. **Count and view toggle:** "355 productos" ("… encontrados" while filtering) on the left; on the right two icon buttons, Cuadrícula/Grid and Lista/List, the selected one in the gradient.
6. **Products:** grid or list (below).
7. **Footer:** name and year, a one-line description; extra bottom padding so the WhatsApp bar never covers it.
8. **WhatsApp bar** (fixed): the gradient main button "Escríbenos por WhatsApp" / "Message us on WhatsApp", WhatsApp logo in green on an indigo circle. Full width on phones, bottom-right on desktop. Opens WhatsApp with a greeting in the page's language.

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
- **Photos:** swipe sideways (scroll snap); the cover shows immediately, the rest load on open (`=w1000`). Up to 8 photos: dots with the current one as a gradient pill. More than 8: a "3 / 24" counter.
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
