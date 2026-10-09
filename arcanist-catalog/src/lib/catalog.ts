import catalogData from '@/data/catalog.json';
import type { Catalog, Product, ProductSummary, Category, Tag } from './types';

const catalog = catalogData as Catalog;

export function getAllProducts(): Product[] {
  return catalog.products;
}

export function getProduct(id: string): Product | undefined {
  return catalog.products.find(p => p.id === id);
}

// A→Z by name (Drive's listing order isn't meaningful); products still waiting for photos go last
export function getProductSummaries(): ProductSummary[] {
  const byName = (a: Product, b: Product) =>
    a.name.localeCompare(b.name, 'es', { sensitivity: 'base', numeric: true });
  const summaries = [...catalog.products].sort(byName).map(p => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    tags: p.tags,
    cover: p.images[0]?.url ?? null,
    photoCount: p.images.length,
  }));
  return [...summaries.filter(p => p.cover), ...summaries.filter(p => !p.cover)];
}

export function getCategories(): Category[] {
  return catalog.categories;
}

export function getTags(): Tag[] {
  return catalog.tags;
}

export function getGeneratedAt(): string {
  return catalog.generatedAt;
}
