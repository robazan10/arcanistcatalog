import Image from 'next/image';
import type { ProductSummary } from '@/lib/types';
import { CARD_WIDTH, sizedImage } from '@/lib/images';
import { PhotosIcon } from './icons';

interface Props {
  product: ProductSummary;
  alt?: boolean;
  onClick: (product: ProductSummary) => void;
}

export default function ProductCard({ product, alt = false, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(product)}
      className={`group rounded-card border-1.5 border-brand-line overflow-hidden text-left transition-colors duration-150 hover:border-brand-mint ${
        alt ? 'bg-white/[0.035]' : 'bg-white/[0.07]'
      }`}
    >
      <div className="relative aspect-square bg-brand-field">
        {product.cover ? (
          <Image
            src={sizedImage(product.cover, CARD_WIDTH)}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="bg-coming-soon w-full h-full grid place-items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/isotype-white.svg" alt="" className="w-[46%] h-auto opacity-30" />
          </div>
        )}
        {product.photoCount === 0 ? (
          <span className="badge-mint absolute bottom-1.5 left-1.5">Fotos pronto</span>
        ) : (
          product.photoCount > 1 && (
            <span
              className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-full border border-brand-line bg-brand-deep/80 px-[7px] py-0.5 text-[11px] font-bold"
              aria-label={`${product.photoCount} fotos`}
            >
              <PhotosIcon />
              {product.photoCount}
            </span>
          )
        )}
      </div>

      <div className="px-2.5 pt-2 pb-2.5">
        <h3 className="text-[19px] leading-[1.05] truncate">{product.name}</h3>
        <span className="badge mt-1.5">{product.category}</span>
      </div>
    </button>
  );
}
