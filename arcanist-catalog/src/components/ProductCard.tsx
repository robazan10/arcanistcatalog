import Image from 'next/image';
import type { Product } from '@/lib/types';

interface Props {
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: Props) {
  const mainImage = product.images[0];

  return (
    <button
      onClick={() => onClick(product)}
      className="group bg-arcane-card border border-arcane-border rounded-xl overflow-hidden text-left hover:border-teal/60 hover:shadow-lg hover:shadow-teal/10 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
    >
      <div className="relative aspect-square overflow-hidden bg-primary-dark">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-silver/20 text-5xl">
            ?
          </div>
        )}
        {product.images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            1 / {product.images.length}
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-cinzel font-semibold text-white text-sm leading-tight mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-teal text-xs truncate">{product.category}</p>
      </div>
    </button>
  );
}
