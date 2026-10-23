# Development rules

Rules specific to this repo. The owner's general rules (approval before any change, branch + PR, no merging) apply on top.

## Workflow in this repo

- **Approval before any change:** before editing or creating files, installing packages, creating or switching branches, committing, pushing or opening a PR, show exactly what will be done and wait for an explicit go-ahead. Read-only checks are fine.
- **Before every commit,** show the exact files (and anything deliberately left out, like `.DS_Store`), the full commit message and the PR title and description, then wait. This applies even when the same message that asked for the change also says "commit".
- **Branch, push, PR.** The owner merges; never merge or enable auto-merge. Commits are authored as Rodrigo Bazan <ro.bazan10@gmail.com>.
- **UI changes start with a phone mockup** the owner approves; save it in `docs/mockups/` with the PR that builds it.
- **After a merge,** wait for the Vercel deploy of `main` and check the live site (see Checks).

## Docs checklist per PR

Every PR updates, in the same change:
- [`roadmap.md`](roadmap.md): "Next up / how to resume" and the PR list.
- [`decisions.md`](decisions.md): any decision made.
- [`architecture.md`](architecture.md): any structural change (routes, modules, data flow, state).
- The setup steps below: any environment change.
- [`ui.md`](ui.md): any screen or component change.
- [`../CLAUDE.md`](../CLAUDE.md): anything that became wrong, and new key facts.

Every PR description has a **"Docs updated:"** line listing the docs changed, or saying why none were needed. Commit messages don't repeat it.

## Checks

- `cd arcanist-catalog && npm run build` passes.
- Look at it at **390px phone width** in the browser before calling a visible change done: no sideways scroll, texts fit in both languages.
- Check both `/` and `/en/` when texts or layout change.
- To check the static build locally, serve `arcanist-catalog/out/` (for example `python3 -m http.server 8766 --bind 127.0.0.1` from inside `out/`) and stop the server afterwards.
- After a merge: the commit status of `main` on GitHub says the Vercel deploy succeeded, and `/`, `/en/` and `/forge/` load on the live site.
- **Gotcha:** a production deploy once failed in 21 s with no code cause (PR #5's preview had passed). A **Redeploy** from the Vercel dashboard fixed it. If a deploy fails, reproduce the build on a fresh clone of `main` first; if that passes, ask the owner to redeploy.
- **Gotcha:** Vercel preview links need a Vercel sign-in, so they can't be checked from scripts; the owner checks them on the phone.

## Code

- Follow [`brand-ui.md`](brand-ui.md): brand tokens only (`brand-indigo`, `brand-mint`…), 12px radius, 1.5px `brand-line` borders, one gradient main button per screen, visible mint focus outline.
- Never serve Chinese Rocks as a web font.
- **Every UI text goes in `src/i18n/dictionaries.ts` in both languages,** never hard-coded in a component (screen-reader labels included).
- Photos always go through `sizedImage(url, width)` from `lib/images.ts`.
- Don't add anything under `/forge`, and keep the `/forge` rules in `vercel.json`.

## Drive data and the catalog script

- The Drive layout and `meta.txt` format are in [`drive-images-schema.md`](drive-images-schema.md). Read it before changing the script or the data.
- **Ask the owner before running the script:** each run sets every listed photo to "anyone with the link can view" in Drive. `--dry-run` changes nothing (no sharing, writes to a temp folder) and doesn't need approval; use it first and compare its `catalog.json` with the committed one.
- After a run, review the summary (products, without photos, without cover, skipped, time), build, check at phone width, and open a PR with `catalog.json` and `catalog-status.md`.
- **Gotcha:** Google's access token lasts one hour. Runs left overnight in October 2026 took 72–87 min (the idle Mac slowed them) and failed with `Invalid Credentials` / `ACCESS_TOKEN_EXPIRED`. Since `fix/script-token-refresh` the client gets a new token and retries on a 401, and a `meta.txt` read error stops the run instead of dropping the product. Run with `caffeinate -i` so the Mac stays awake.
- Cover rule: the image named `cover`/`Cover` goes first; rename files in Drive, not in code.
- Fix data problems (typos, category names) in Drive, not in code.
- Editing files in Drive from Claude Code works through the synced folder (below); ask before renaming or moving anything there, and never delete.

## Commands

| What | Command |
|---|---|
| Install site dependencies | `cd arcanist-catalog && npm install` |
| Dev server | `cd arcanist-catalog && npm run dev` → http://localhost:3000 |
| Production build | `cd arcanist-catalog && npm run build` → `out/` |
| Install script dependencies | `cd scripts/generate-manifest && npm install` |
| Preview a catalog run (changes nothing) | `cd scripts/generate-manifest && caffeinate -i node index.js --dry-run` |
| Regenerate the catalog | `cd scripts/generate-manifest && caffeinate -i node index.js` (ask the owner first) |

## Setup on a new machine

1. **Node:** v18 or newer (v26 used on 2026-10-12). `git`, and `gh` logged in as robazan10.
2. **Clone** `robazan10/arcanistcatalog`, then install both: `arcanist-catalog/` and `scripts/generate-manifest/`.
3. **Service account key** for the script: the owner keeps the JSON key file in Google Drive, directly in `My Drive/3D Arcanist/` (ask the owner for the exact file name; it isn't written here because this repo is public). Copy it to `scripts/generate-manifest/service-account-key.json` without opening it, then `chmod 600` it. It's git-ignored; check with `git check-ignore -v scripts/generate-manifest/service-account-key.json`. **Never commit it; the repo is public.**
4. **Root folder:** `rootFolderId` in `scripts/generate-manifest/config.json` must be the Drive ID of `3D Arcanist/Images` (verified on 2026-10-12: `1X4d0UnWh11CBaZUIlWhKOrcI9M6Y1hmH`).
5. **Reading the Drive folder from Claude Code (optional, for counts and checks):** Google Drive for desktop syncs it to `~/Library/CloudStorage/GoogleDrive-<account>/My Drive/3D Arcanist/Images`. macOS blocks the Claude app from it until **System Settings → Privacy & Security → Full Disk Access → Claude** is on, and the app is fully quit (Cmd+Q) and reopened. Listing files doesn't download them.
6. **Vercel:** the project builds `main` with `vercel.json`. The Vercel CLI isn't installed; build logs are in the dashboard.
