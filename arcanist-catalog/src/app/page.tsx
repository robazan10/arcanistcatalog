import { getAllProducts, getCategories } from '@/lib/catalog';
import CatalogClient from '@/components/CatalogClient';

export default function Home() {
  const products = getAllProducts();
  const categories = getCategories();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <CatalogClient products={products} categories={categories} />
    </main>
  );
}
