import { getProductSummaries, getCategories } from '@/lib/catalog';
import CatalogClient from './CatalogClient';
import type { Lang } from '@/i18n/dictionaries';

export default function HomePage({ lang }: { lang: Lang }) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <CatalogClient products={getProductSummaries()} categories={getCategories()} lang={lang} />
    </main>
  );
}
