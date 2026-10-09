import catalogData from '@/data/catalog.json';
import type { Catalog, Product, ProductSummary, Category, Tag } from './types';

const catalog = catalogData as Catalog;

export function getAllProducts(): Product[] {
  return catalog.products;
}

export function getProduct(id: string): Product | undefined {
  return catalog.products.find(p => p.id === id);
}

// Products with photos first; those still waiting for photos go last, keeping their order
export function getProductSummaries(): ProductSummary[] {
  const summaries = catalog.products.map(p => ({
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
