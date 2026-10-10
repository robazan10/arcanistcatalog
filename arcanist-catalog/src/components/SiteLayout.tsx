import '@/app/globals.css';
import Header from './Header';
import CTAButtons from './CTAButtons';
import { displayFont, sansFont } from '@/lib/fonts';
import { SITE } from '@/lib/config';
import { getDictionary, type Lang } from '@/i18n/dictionaries';

// The <html> shell shared by the Spanish and English root layouts
export default function SiteLayout({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const t = getDictionary(lang);
  return (
    <html lang={t.htmlLang} className={`${displayFont.variable} ${sansFont.variable}`}>
      <body className="font-sans text-white min-h-screen">
        <Header lang={lang} />
        {children}
        <CTAButtons lang={lang} />
        <footer className="border-t-1.5 border-brand-line mt-16 pt-8 pb-28 sm:pb-10 text-center px-4">
          <p className="font-display text-lg tracking-[0.02em]">
            {SITE.name} &copy; {new Date().getFullYear()}
          </p>
          <p className="text-brand-lavender text-xs mt-1">{t.footer}</p>
        </footer>
      </body>
    </html>
  );
}
