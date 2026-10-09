// Lowercase and strip accents, so "dragon" matches "dragón" and "Tamaño" matches "tamano"
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

const QUERY_PARAM = 'q';

export function readQueryFromUrl(): string {
  return new URLSearchParams(window.location.search).get(QUERY_PARAM) ?? '';
}

// Keeps the search in the address (?q=...) so it can be shared and survives Back.
// push adds a history entry (tapping a tag); otherwise the current entry is replaced (typing).
export function writeQueryToUrl(query: string, { push = false } = {}) {
  const url = new URL(window.location.href);
  if (query) url.searchParams.set(QUERY_PARAM, query);
  else url.searchParams.delete(QUERY_PARAM);
  if (url.href === window.location.href) return;
  if (push) window.history.pushState(null, '', url);
  else window.history.replaceState(null, '', url);
}
