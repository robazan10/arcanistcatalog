import Image from 'next/image';
import type { ProductSummary } from '@/lib/types';
import type { Dictionary } from '@/i18n/dictionaries';
import { ROW_WIDTH, sizedImage } from '@/lib/images';
import { ArrowIcon, PhotosIcon } from './icons';

interface Props {
  product: ProductSummary;
  alt?: boolean;
  t: Dictionary;
  onClick: (product: ProductSummary) => void;
}

// Model-type tags from the Drive tag conventions (docs/drive-images-schema.md), in English only
const MODEL_TYPES = ['chibi', 'toon', 'extra', 'bust', 'fullsize', 'diorama'];

// List view row: small cover, name, brand, model type and photo count
export default function ProductRow({ product, alt = false, t, onClick }: Props) {
  const modelTypes = product.tags.filter(tag => MODEL_TYPES.includes(tag.toLowerCase()));

  return (
    <button
      onClick={() => onClick(product)}
      className={`flex items-center gap-3 w-full rounded-card border-1.5 border-brand-line py-2 pl-2 pr-2.5 text-left transition-colors duration-150 hover:border-brand-mint ${
        alt ? 'bg-white/[0.035]' : 'bg-white/[0.07]'
      }`}
    >
      <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-[10px] bg-brand-field">
        {product.cover ? (
          <Image src={sizedImage(product.cover, ROW_WIDTH)} alt="" fill className="object-cover" sizes="64px" />
        ) : (
          <div className="bg-coming-soon w-full h-full grid place-items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/isotype-white.svg" alt="" className="w-[60%] h-auto opacity-30" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg leading-[1.05] line-clamp-2">{product.name}</h3>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
          <span className="badge">{product.category}</span>
          {modelTypes.length > 0 && (
            <span className="text-[11px] text-brand-lavender border-1.5 border-brand-line rounded-full px-2 leading-[18px]">
              {modelTypes.join(' · ')}
            </span>
          )}
          {product.photoCount > 0 ? (
            <span className="flex items-center gap-1 text-xs font-bold text-brand-lavender" aria-label={t.photos(product.photoCount)}>
              <PhotosIcon />
              {product.photoCount}
            </span>
          ) : (
            <span className="badge-mint">{t.comingSoon}</span>
          )}
        </div>
      </div>

      <ArrowIcon dir="right" className="w-[18px] h-[18px] flex-shrink-0 text-brand-lavender" />
    </button>
  );
}
