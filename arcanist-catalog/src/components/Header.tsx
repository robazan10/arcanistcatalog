import { SITE } from '@/lib/config';
import { getDictionary, type Lang } from '@/i18n/dictionaries';
import InstagramButton from './InstagramButton';
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
          <InstagramButton label={t.instagramFollow} />
        </div>
      </div>
    </header>
  );
}
