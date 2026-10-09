# Arcanist's Dice: brand and UI guide

How to apply the Arcanist's Dice brand guide to the website. These decisions were made while building D4 Stat Forge (`robazan10/d4-stat-forge`, live at www.arcanistsdice.com/forge), which already follows them; open it to see every pattern below working.

Source of truth: the brand guide PDF `ArcanistsDice_D.pdf` (11 pages: logo versions, palette, typography), on the owner's computer in `Desktop/Arcanist's Dice/Branding/Editables Original/ILLUSTRATOR/`.

## Palette

From page 10 of the brand guide. Use these exact values.

| Token | Hex | Role |
|---|---|---|
| indigo | `#2E3192` | Page background (dark theme), primary brand color, text on light surfaces |
| deep | `#1F2170` | Darker end of the page background gradient |
| violet | `#A57FFF` | Accent: highlights, selected states, gradient end |
| lavender | `#D7CEEA` | Secondary text and icons on the dark background |
| lilac | `#EFEBF7` | Light surfaces (light sections, cards on light backgrounds) |
| mint | `#3FFFB1` | Positive and active states: success, "available", active nav item, gradient start |
| gradient | `#3FFFB1 → #A57FFF` | The brand's signature: main buttons, headline numbers or titles, active tab underline. Use sparingly |

Supporting values used in D4 Stat Forge (not in the guide, derived from it):

| Token | Value | Role |
|---|---|---|
| line | `#5357C2` | Borders on the dark background |
| field | `#25277C` | Input and track backgrounds |
| panel | `rgba(255,255,255,0.07)` | Card background on indigo |
| danger | `#FF7A9A` | Warnings and errors (the brand has no red; this pink-red sits well next to violet) |

Page background: `radial-gradient(ellipse at top, #3a3db0 0%, #2E3192 40%, #1F2170 100%)` with a solid `#1F2170` fallback.

## Typography

| Use | Font | License |
|---|---|---|
| Headings, big numbers, tab names, short labels | **Staatliches** (Google Fonts) | Open (OFL), free for websites |
| Body text, buttons, forms | **Nunito** 400/600/700/800 (Google Fonts) | Open (OFL), free for websites |
| Logo wordmark | Chinese Rocks, already outlined in the logo SVGs | Not needed as a font |

**Chinese Rocks (the brand font) can't be used as a web font.** Its Typodermic Desktop EULA (in `Branding/chinese_rocks/`) allows commercial use on a computer (logos, images, print, PDFs) but forbids distributing the font file. A website serving `.otf`/`.ttf` files via `@font-face` distributes it. This site currently does: `arcanist-catalog/public/chinese-rocks-rg.otf` and `.ttf` are committed to this public repo and loaded in `globals.css`. Replace them with Staatliches, delete the files, and stop tracking them, unless the owner buys a Typodermic web license. (This is a reading of the license, not legal advice.)

Staatliches is uppercase-only by design, like Chinese Rocks: use it for short display text, never for paragraphs.

## Logos

Brand SVGs live in `Desktop/Arcanist's Dice/Branding/Editables Original/SVG/`:

| File | What | Use |
|---|---|---|
| `Imagotype/DarkBackground/ArcanistsDice-DB.svg` | Full logo (d20, book, wordmark) for dark backgrounds | Hero, header on wide screens |
| `Imagotype/FullColor/ArcanistsDice-FC1.svg` | Full logo for light backgrounds | Light sections, print |
| `Isotype/ArcanistsDice-Icon03.svg` | Book symbol, white | Compact header, app icon on the gradient |
| `Isotype/ArcanistsDice-Icon04.svg` | Book symbol, indigo | Favicon on light, small marks |

Copy the ones you need into `arcanist-catalog/public/brand/` and reference them as files (`<img>` or `next/image`), not inlined, since several SVGs reuse the same CSS class names (`.cls-1`...) and would clash on one page. The wordmark in these SVGs is drawn as shapes, so it doesn't depend on the font license.

D4 Stat Forge's app icon (`d4-stat-forge/public/icon.svg`) is the white book symbol on the mint→violet gradient, full bleed; reuse that recipe for this site's favicon and social image.

## Component patterns

One visual language, used across D4 Stat Forge:

- **Corners and borders:** 12px radius on cards, inputs and buttons; 1.5px borders in `line`. The logo has thick, rounded outlines, so avoid sharp corners and hairline borders.
- **Cards:** `panel` background, 1.5px `line` border, 12px radius. In lists, alternate a slightly lighter and darker card so items are easy to tell apart.
- **Main button:** the gradient as background, indigo text, weight 800. Only one per screen.
- **Secondary button:** `panel` background, `line` border, white text; border turns mint or violet on hover.
- **Chips:** pill-shaped toggles (999px radius). The selected chip takes the gradient fill with indigo text. Use them instead of dropdowns for short option lists.
- **Badges:** small pills with a tinted background and matching text: violet `rgba(165,127,255,.25)` with `#CDB8FF`, mint `rgba(63,255,177,.18)` with mint, danger `rgba(255,122,154,.22)` with `#FF7A9A`.
- **Headline numbers or titles:** Staatliches with the gradient as text fill (`background-clip: text`).
- **Bars:** 6–8px tall, rounded, `field` track with a gradient fill. Prefer bars over pies or rings, so every screen uses the same few shapes.
- **Header:** the white book symbol, the name in Staatliches, a small lavender subtitle; the active nav item in mint.
- **Focus:** a visible 2px outline (mint or violet) on every interactive element.
- **Motion:** keep it subtle (hover color changes, 150ms); respect `prefers-reduced-motion`.

## Tailwind tokens

Drop-in replacement for the `colors` and `fontFamily` in `arcanist-catalog/tailwind.config.ts`:

```ts
colors: {
  brand: {
    indigo: '#2E3192',
    deep: '#1F2170',
    violet: '#A57FFF',
    lavender: '#D7CEEA',
    lilac: '#EFEBF7',
    mint: '#3FFFB1',
    line: '#5357C2',
    field: '#25277C',
    danger: '#FF7A9A',
  },
},
fontFamily: {
  display: ['Staatliches', 'Impact', 'Arial Narrow', 'sans-serif'],
  sans: ['Nunito', 'Segoe UI', 'system-ui', 'sans-serif'],
},
borderRadius: {
  card: '12px',
},
backgroundImage: {
  'brand-gradient': 'linear-gradient(90deg, #3FFFB1, #A57FFF)',
  'brand-page': 'radial-gradient(ellipse at top, #3a3db0 0%, #2E3192 40%, #1F2170 100%)',
},
```

Load the fonts with `next/font/google` (`Staatliches`, and `Nunito` with weights 400, 600, 700 and 800). It self-hosts them at build time, which works with the static export.

## Where to see it

- Live: https://www.arcanistsdice.com/forge (sign-in screen, then characters and the calculator)
- Code: `robazan10/d4-stat-forge`, mainly `src/index.css` (all tokens and components), `src/app/Layout.tsx` (header) and `src/screens/SignIn.tsx` (logo hero)
