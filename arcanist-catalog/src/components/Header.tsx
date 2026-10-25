import { SITE, SOCIAL } from '@/lib/config';
import { getDictionary, type Lang } from '@/i18n/dictionaries';
import { InstagramIcon } from './icons';
import LanguageSwitch from './LanguageSwitch';
import TypeMenu from './TypeMenu';
import { getAllProducts, getMenuTypes } from '@/lib/catalog';

export default function Header({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const menuTypes = getMenuTypes();
  return (
    <header className="sticky top-0 z-40 bg-brand-deep/90 backdrop-blur-md border-b-1.5 border-brand-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2.5 sm:gap-3">
        {/* No menu with a catalog made before product types existed */}
        {menuTypes.length > 0 && <TypeMenu types={menuTypes} total={getAllProducts().length} lang={lang} />}
        <div className="min-w-0">
          <p className="font-display text-[20px] sm:text-[22px] leading-none tracking-[0.02em] whitespace-nowrap">{SITE.name}</p>
          <p className="text-brand-lavender text-[11px] mt-0.5 truncate">
            <span className="sm:hidden">{t.taglineShort}</span>
            <span className="hidden sm:inline">{t.tagline}</span>
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitch lang={lang} />
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.instagramFollow}
            className="grid place-items-center w-11 h-11 flex-shrink-0 rounded-card border-1.5 border-brand-line bg-white/[0.07] text-brand-lavender transition-colors duration-150 hover:border-brand-mint hover:text-white"
          >
            <InstagramIcon className="w-[18px] h-[18px]" />
          </a>
        </div>
      </div>
    </header>
  );
}
