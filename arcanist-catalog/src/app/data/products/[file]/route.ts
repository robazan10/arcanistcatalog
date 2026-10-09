import { getAllProducts, getProduct } from '@/lib/catalog';

// One static JSON file per product (out/data/products/<id>.json) with its photo URLs,
// fetched when the product opens so the home page doesn't carry every photo link.
export const dynamic = 'force-static';

export function generateStaticParams() {
  return getAllProducts().map(p => ({ file: `${p.id}.json` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const product = getProduct(file.replace(/\.json$/, ''));
  return Response.json({ images: product?.images.map(img => img.url) ?? [] });
}
