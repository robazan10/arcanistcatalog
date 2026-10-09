export interface ProductImage {
  filename: string;
  url: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  tags: string[];
  images: ProductImage[];
}

export interface Category {
  id: string;
  name: string;
  productIds: string[];
}

export interface Tag {
  id: string;
  name: string;
  productIds: string[];
}

export interface Catalog {
  generatedAt: string;
  products: Product[];
  categories: Category[];
  tags: Tag[];
}

// What the grid needs; the full photo list loads when a product opens
export interface ProductSummary {
  id: string;
  name: string;
  brand: string;
  category: string;
  tags: string[];
  cover: string | null;
  photoCount: number;
}
