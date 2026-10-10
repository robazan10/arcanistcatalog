import { SITE, SOCIAL } from '@/lib/config';
import { getDictionary, type Lang } from '@/i18n/dictionaries';
import { InstagramIcon } from './icons';
import LanguageSwitch from './LanguageSwitch';

export default function Header({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  return (
    <header className="sticky top-0 z-40 bg-brand-deep/90 backdrop-blur-md border-b-1.5 border-brand-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/isotype-white.svg" alt="" className="w-10 h-auto flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-display text-[22px] leading-none tracking-[0.02em]">{SITE.name}</p>
          <p className="text-brand-lavender text-[11px] mt-0.5 truncate">{t.tagline}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitch lang={lang} />
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.instagramFollow}
            className="grid place-items-center w-9 h-9 flex-shrink-0 rounded-card border-1.5 border-brand-line bg-white/[0.07] text-brand-lavender transition-colors duration-150 hover:border-brand-mint hover:text-white"
          >
            <InstagramIcon className="w-[18px] h-[18px]" />
          </a>
        </div>
      </div>
    </header>
  );
}
