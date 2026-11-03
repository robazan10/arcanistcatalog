// How long a product shows as "Nuevo", from the date the catalog script gave it (newSince)
const NEW_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

const NEW_PARAM = 'new';

// Checked against today's date in the browser, so the label goes away without a new deploy
export function isNewProduct(newSince: string | null, now: number): boolean {
  if (!newSince) return false;
  return now - new Date(newSince).getTime() < NEW_DAYS * DAY_MS;
}

export function readNewFromUrl(): boolean {
  return new URLSearchParams(window.location.search).has(NEW_PARAM);
}

// Keeps the "Nuevos" chip in the address (?new=1) so it can be linked from Instagram.
// push adds a history entry (tapping a chip); otherwise the current entry is replaced.
export function writeNewToUrl(on: boolean, { push = false } = {}) {
  const url = new URL(window.location.href);
  if (on) url.searchParams.set(NEW_PARAM, '1');
  else url.searchParams.delete(NEW_PARAM);
  if (url.href === window.location.href) return;
  if (push) window.history.pushState(null, '', url);
  else window.history.replaceState(null, '', url);
}
