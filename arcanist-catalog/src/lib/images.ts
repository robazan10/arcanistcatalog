// Google resizes Drive images on its side when the URL ends in =w<width>
export const CARD_WIDTH = 500;
export const VIEWER_WIDTH = 1000;
export const ROW_WIDTH = 200;
// Squares in the product's photo grid (3 columns on phones, 6 on desktop)
export const GRID_WIDTH = 300;

export function sizedImage(url: string, width: number): string {
  return `${url}=w${width}`;
}

export function productDataUrl(id: string): string {
  return `/data/products/${id}.json`;
}
