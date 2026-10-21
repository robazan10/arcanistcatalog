# Project docs

These docs are meant to be enough for a new chat or machine to continue the work from the repo alone. Start with **"Next up / how to resume"** in [`roadmap.md`](roadmap.md). Every PR keeps them current (see the checklist in [`development-rules.md`](development-rules.md)).

| File | What it covers | Update it when |
|---|---|---|
| [`roadmap.md`](roadmap.md) | Where things stand, how to resume, phase status, every PR, agreed scope of the next phase, backlog | A PR is opened or merged, the plan changes, or something is deferred |
| [`decisions.md`](decisions.md) | Dated log of decisions, with why and the alternatives | Any decision that affects the files here |
| [`architecture.md`](architecture.md) | Data flow from Drive to the live site, routes, code layout, state, images | The structure, a route or the stack changes |
| [`development-rules.md`](development-rules.md) | Workflow, docs checklist, checks, code and data rules, setup on a new machine, commands | A rule, a check or the setup changes |
| [`ui.md`](ui.md) | UX principles, then the screen guide: each part of the page, its states, and the agreed mockups | A screen or component is added or its layout or look changes |
| [`brand-ui.md`](brand-ui.md) | Brand guide applied to the web: palette, fonts and licenses, logos, component patterns, Tailwind tokens | The brand guide or a component pattern changes |
| [`drive-images-schema.md`](drive-images-schema.md) | The Drive `Images` folder: layout, `meta.txt`, tag and naming conventions, the 2026-10-09 reorganization | The Drive layout or `meta.txt` format changes |
| [`catalog-status.md`](catalog-status.md) | Products without photos, without a cover, and skipped folders | Never by hand: the catalog script rewrites it on every run |
| [`mockups/`](mockups/) | The agreed phone mockups, as HTML pages that open in a browser | A new mockup is agreed |

[`../CLAUDE.md`](../CLAUDE.md) is the short summary Claude Code reads first, and it points here. [`../README.md`](../README.md) explains how to regenerate the catalog and run the site. [`../PLAN.md`](../PLAN.md) is the original May 2026 plan, kept for history.
