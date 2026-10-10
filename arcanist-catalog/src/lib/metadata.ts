import type { Metadata, Viewport } from 'next';
import { SITE } from './config';
import { HOME_PATH, getDictionary, type Lang } from '@/i18n/dictionaries';

// Title, description and link previews for each language, and the alternate-language links for search engines
export function buildMetadata(lang: Lang): Metadata {
  const t = getDictionary(lang);
  const url = `${SITE.url}${HOME_PATH[lang]}`;
  return {
    metadataBase: new URL(SITE.url),
    title: SITE.name,
    description: t.meta.description,
    alternates: {
      canonical: HOME_PATH[lang],
      languages: { es: HOME_PATH.es, en: HOME_PATH.en, 'x-default': HOME_PATH.es },
    },
    openGraph: {
      title: SITE.name,
      description: t.meta.description,
      url,
      siteName: SITE.name,
      locale: t.ogLocale,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE.name,
      description: t.meta.description,
      images: ['/og-image.png'],
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#1F2170',
};
