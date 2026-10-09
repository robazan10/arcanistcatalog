import Image from 'next/image';
import type { Product } from '@/lib/types';
import { PhotosIcon } from './icons';

interface Props {
  product: Product;
  alt?: boolean;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, alt = false, onClick }: Props) {
  const mainImage = product.images[0];

  return (
    <button
      onClick={() => onClick(product)}
      className={`group rounded-card border-1.5 border-brand-line overflow-hidden text-left transition-colors duration-150 hover:border-brand-mint ${
        alt ? 'bg-white/[0.035]' : 'bg-white/[0.07]'
      }`}
    >
      <div className="relative aspect-square bg-brand-field">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-lavender/40 font-display text-5xl">
            ?
          </div>
        )}
        {product.images.length > 1 && (
          <span
            className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-full border border-brand-line bg-brand-deep/80 px-[7px] py-0.5 text-[11px] font-bold"
            aria-label={`${product.images.length} fotos`}
          >
            <PhotosIcon />
            {product.images.length}
          </span>
        )}
      </div>

      <div className="px-2.5 pt-2 pb-2.5">
        <h3 className="text-[19px] leading-[1.05] truncate">{product.name}</h3>
        <span className="badge mt-1.5">{product.category}</span>
      </div>
    </button>
  );
}
