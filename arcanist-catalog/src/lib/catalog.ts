import catalogData from '@/data/catalog.json';
import type { Catalog, Product, Category, Tag } from './types';

const catalog = catalogData as Catalog;

export function getAllProducts(): Product[] {
  return catalog.products;
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
