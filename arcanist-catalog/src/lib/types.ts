export interface ProductImage {
  filename: string;
  url: string;
}

export interface Product {
  id: string;
  name: string;
  // Type id from the Drive type folder (figures, keycaps…); missing in catalogs made before phase 4
  type?: string;
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

// A Drive type folder ("01 Figures"): the side menu's sections
export interface ProductType {
  id: string;
  name: string;
  order: number | null;
  productIds: string[];
}

// What the menu needs of each type
export interface MenuType {
  id: string;
  name: string;
  count: number;
}

export interface Tag {
  id: string;
  name: string;
  productIds: string[];
}

export interface Catalog {
  generatedAt: string;
  products: Product[];
  types?: ProductType[];
  categories: Category[];
  tags: Tag[];
}

// What the grid needs; the full photo list loads when a product opens
export interface ProductSummary {
  id: string;
  name: string;
  type: string | null;
  brand: string;
  category: string;
  tags: string[];
  cover: string | null;
  photoCount: number;
}
