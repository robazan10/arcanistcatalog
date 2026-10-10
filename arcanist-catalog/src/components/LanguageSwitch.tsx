'use client';

import { HOME_PATH, LANGS, getDictionary, type Lang } from '@/i18n/dictionaries';

// ES | EN pill. Keeps the current search (?q=...) when switching.
export default function LanguageSwitch({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  return (
    <div
      className="flex flex-shrink-0 rounded-full border-1.5 border-brand-line bg-white/[0.07] p-0.5"
      role="group"
      aria-label={t.languageSwitch}
    >
      {LANGS.map(code => (
        <a
          key={code}
          href={HOME_PATH[code]}
          hrefLang={code}
          lang={code}
          aria-current={code === lang ? 'true' : undefined}
          onClick={e => {
            e.currentTarget.href = HOME_PATH[code] + window.location.search;
          }}
          className={`rounded-full px-2.5 py-1 text-xs font-extrabold transition-colors duration-150 ${
            code === lang ? 'bg-brand-gradient text-brand-indigo' : 'text-brand-lavender hover:text-white'
          }`}
        >
          {code.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
