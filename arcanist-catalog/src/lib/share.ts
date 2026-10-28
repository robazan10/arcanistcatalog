import { SITE } from './config';
import { HOME_PATH, type Lang } from '@/i18n/dictionaries';

const PRODUCT_PARAM = 'p';

export function readProductFromUrl(): string {
  return new URLSearchParams(window.location.search).get(PRODUCT_PARAM) ?? '';
}

// Keeps the open product in the address (?p=tanuki-gojo), so the address bar always holds a link to it.
// Replaces the current entry: opening a product doesn't add a Back step.
export function writeProductToUrl(id: string) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set(PRODUCT_PARAM, id);
  else url.searchParams.delete(PRODUCT_PARAM);
  if (url.href !== window.location.href) window.history.replaceState(null, '', url);
}

// The link that opens one product directly, in the page's language
export function productLink(id: string, lang: Lang): string {
  return `${SITE.url}${HOME_PATH[lang]}?${PRODUCT_PARAM}=${encodeURIComponent(id)}`;
}

// The page as it is now (type and search), without an open product
export function currentViewLink(): string {
  const url = new URL(window.location.href);
  url.searchParams.delete(PRODUCT_PARAM);
  return `${SITE.url}${url.pathname}${url.search}`;
}

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed';

// Phones open their own share menu; elsewhere the link is copied
export async function shareLink(url: string, title: string): Promise<ShareResult> {
  const touch = window.matchMedia('(pointer: coarse)').matches;
  if (touch && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, url });
      return 'shared';
    } catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return 'cancelled';
      // Share menu unavailable: fall back to copying
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'failed';
  }
}
