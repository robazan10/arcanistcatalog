# Usage analytics

What the site counts, how, and why. Agreed with the owner on 2026-10-29 (phase 6). **Keep this file current:** when an event is added, removed or changed, update the table below in the same PR.

## Setup

- **Tool:** [Umami Cloud](https://cloud.umami.is), free "Hobby" plan, the owner's account. Website "Arcanist's Dice", domain `www.arcanistsdice.com`.
- **Website ID:** `2c846acd-c1d8-4391-84a0-a0205fb5da64`. Not a secret: it's in the site's public code. It lives in `UMAMI` in `arcanist-catalog/src/lib/config.ts`.
- **Script:** `https://cloud.umami.is/script.js`, loaded in `SiteLayout` with `data-domains="www.arcanistsdice.com"`, so only the live site counts. Vercel previews, local builds and Claude Code's checks send nothing.
- **Page views are sent by hand, once per page load** (`data-auto-track="false"`). Umami would otherwise count every change to the address, and the site changes it on every search, type and opened product (`?q=`, `?type=`, `?p=`).
- **Code:** components call `track(event, data)` from `src/lib/analytics.ts`, never Umami directly, so the tool can be swapped in one file. When the script isn't loaded, `track()` does nothing.
- **Plan limits** (checked on umami.is/pricing on 2026-10-29): 100,000 events a month, page views included; 1 website; data kept for **6 months**. At 5–10 events per visit that is about 10,000–20,000 visits a month. Check the monthly count in the dashboard now and then.
- **Export the data** from the Umami dashboard every few months (it keeps 6 months).

## Privacy

No personal data: no names, phone numbers or anything typed besides the search text. Umami uses no cookies; it records country, device, browser and where the visit came from (Instagram, WhatsApp, Google…).

## Links posted on Instagram

Add `utm_source` (and optionally `utm_campaign`) to links posted outside the site, so those visits show as their own source: `https://www.arcanistsdice.com/?type=keycaps&utm_source=instagram&utm_campaign=keycaps-oct`.

## What is counted

Data values are short strings or numbers. Product ids are brand + name (`hiko-demon-slayer`); type ids are `figures`, `keycaps`, `dice`, `others`.

| Event | When | Data | What it tells |
|---|---|---|---|
| Page view | Once per page load | page, language, full address (with `?type=`, `?p=`, `utm_…`) | Visits and where they come from |
| `product_view` | A product view opens (a tap, or a `?p=` link) | `id`, `type`, `brand`, `lang` | Most viewed products |
| `whatsapp_click` | "Consultar este producto", or the WhatsApp bar | `product` (id, or `general` for the bar), `type`, `lang` | Most asked-about products: the closest signal to a sale |
| `share` | "Compartir" in a product view or next to the results | `target` (product id, or `search`), `method` (`shared` = phone menu, `copied`, `cancelled`, `failed`) | What gets sent to friends |
| `search` | Typing stops for 1 second, with at least 2 letters | `query`, `results`, `type` | What people look for; 0 results shows demand |
| `type_click` | A type in the menu, a type chip, or a "Ver Figuras" button in Dados | `type`, `from` (`menu`, `chips`, `soon`) | Interest in each section |
| `brand_click` | A brand chip inside a type | `brand`, `type` | Interest in each designer's models |
| `tag_click` | A tag in a product view | `tag`, `product` | Interest by series and character |
| `photos` | The "19 fotos" photo grid opens | `product`, `photos` | Products whose photos get looked at |
| `instagram_click` | The Instagram button in the header | — | Interest in the Instagram account |
| `language_switch` | ES \| EN | `to` | How many use English |
| `view_toggle` | Grid / list | `view` | Which view people prefer |

## First report

After 2–4 weeks of data: products ranked by views and by `whatsapp_click`, the most shared products, and searches with 0 results.
