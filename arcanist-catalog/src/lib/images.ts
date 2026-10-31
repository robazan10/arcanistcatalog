import PHOTO_FRAMES from './photo-frames.json';

// Google resizes Drive images on its side when the URL ends in =w<width>
export const CARD_WIDTH = 500;
export const VIEWER_WIDTH = 1000;
export const ROW_WIDTH = 200;
// Tiles in the product's photo grid (3 columns on phones, 6 on desktop)
export const GRID_WIDTH = 300;

export function sizedImage(url: string, width: number): string {
  return `${url}=w${width}`;
}

// Shape (width/height) of the product view's photo frame on phones, by type, matching most of its photos;
// other types get a square. The whole photo always shows inside it. The catalog script reads the same file
// to list photos that fill too little of their frame (docs/catalog-status.md).
export function photoFrame(type: string | null): string {
  return (type && (PHOTO_FRAMES as Record<string, string>)[type]) || '1/1';
}

export function productDataUrl(id: string): string {
  return `/data/products/${id}.json`;
}
