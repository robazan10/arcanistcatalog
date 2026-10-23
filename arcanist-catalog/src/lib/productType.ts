// Types shown in the menu even with no products yet, as "coming soon": the shop is called Arcanist's Dice
export const COMING_SOON_TYPES = ['dice'];

const TYPE_PARAM = 'type';
// Fired when the menu changes ?type=, so every part of the page follows it
export const TYPE_EVENT = 'typechange';

export function readTypeFromUrl(): string {
  return new URLSearchParams(window.location.search).get(TYPE_PARAM) ?? '';
}

// Keeps the selected type in the address (?type=keycaps) so a section can be linked and Back returns to it.
// Changing the type starts a new search, empty unless a query is given (a tapped tag).
export function writeTypeToUrl(type: string, query = '') {
  const url = new URL(window.location.href);
  if (type) url.searchParams.set(TYPE_PARAM, type);
  else url.searchParams.delete(TYPE_PARAM);
  if (query) url.searchParams.set('q', query);
  else url.searchParams.delete('q');
  if (url.href !== window.location.href) window.history.pushState(null, '', url);
  window.dispatchEvent(new Event(TYPE_EVENT));
}
