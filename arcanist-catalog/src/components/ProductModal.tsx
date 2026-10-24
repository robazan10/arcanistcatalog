'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import type { ProductSummary } from '@/lib/types';
import { SOCIAL, whatsappLink } from '@/lib/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { GRID_WIDTH, ROW_WIDTH, VIEWER_WIDTH, productDataUrl, sizedImage } from '@/lib/images';
import { ArrowIcon, GridIcon, InstagramIcon, WhatsAppMark } from './icons';

interface Props {
  product: ProductSummary | null;
  onClose: () => void;
  onTagClick: (tag: string) => void;
  t: Dictionary;
}

const VISIBLE_TAGS = 5;

// Photo lists already fetched in this visit, by product id
const imageCache = new Map<string, string[]>();

export default function ProductModal({ product, onClose, onTagClick, t }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  // All the photos as a grid, inside the product view
  const [showGrid, setShowGrid] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const photosRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);

  // The gallery is a scroll-snap strip; its scroll position is the source of truth for the index
  const indexFromScroll = () => {
    const el = galleryRef.current;
    return el ? Math.round(el.scrollLeft / el.clientWidth) : 0;
  };

  const goTo = useCallback((i: number) => {
    const el = galleryRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  }, []);

  // Show the cover right away, then swap in the full photo list
  useEffect(() => {
    setCurrentIndex(0);
    setShowAllTags(false);
    setShowGrid(false);
    if (!product?.cover) {
      setImages([]);
      return;
    }
    const cached = imageCache.get(product.id);
    setImages(cached ?? [product.cover]);
    if (cached || product.photoCount < 2) return;

    let cancelled = false;
    fetch(productDataUrl(product.id))
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { images: string[] }) => {
        imageCache.set(product.id, data.images);
        if (!cancelled) setImages(data.images);
      })
      .catch(() => {
        // Keep showing the cover alone
      });
    return () => {
      cancelled = true;
    };
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [product]);

  // From the grid back to the gallery, on the chosen photo (the gallery mounts again at the first one)
  const openPhoto = useCallback((i: number) => {
    setShowGrid(false);
    requestAnimationFrame(() => {
      const el = galleryRef.current;
      el?.scrollTo({ left: i * el.clientWidth });
      setCurrentIndex(i);
      photosRef.current?.focus();
    });
  }, []);

  const closeGrid = useCallback(() => openPhoto(currentIndex), [openPhoto, currentIndex]);

  useEffect(() => {
    if (showGrid) backRef.current?.focus();
  }, [showGrid]);

  // Keep the current photo's thumbnail in view, centered in the strip
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[currentIndex] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    strip.scrollTo({ left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2, behavior: 'smooth' });
  }, [currentIndex, images, showGrid]);

  useEffect(() => {
    if (!product) return;
    const lastIndex = images.length - 1;
    const handleKey = (e: KeyboardEvent) => {
      // In the grid, Escape goes back to the photo; the arrows belong to the gallery
      if (showGrid) {
        if (e.key === 'Escape') closeGrid();
        return;
      }
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goTo(Math.min(indexFromScroll() + 1, lastIndex));
      if (e.key === 'ArrowLeft') goTo(Math.max(indexFromScroll() - 1, 0));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, images, onClose, goTo, showGrid, closeGrid]);

  if (!product) return null;

  const whatsappUrl = whatsappLink(t.whatsappProductMessage(product.name));
  const total = product.photoCount;
  const hasMany = total > 1;
  const hiddenTags = product.tags.length - VISIBLE_TAGS;
  const tags = showAllTags ? product.tags : product.tags.slice(0, VISIBLE_TAGS);

  const onGalleryScroll = () => setCurrentIndex(indexFromScroll());

  const closeButton = (
    <button
      ref={closeRef}
      onClick={onClose}
      aria-label={t.close}
      className="absolute top-2.5 right-2.5 grid place-items-center w-9 h-9 rounded-card border-1.5 border-brand-line bg-brand-deep/80 text-xl leading-none transition-colors duration-150 hover:border-brand-mint"
    >
      &times;
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6 bg-[rgba(15,16,60,0.6)] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
        className={`w-full md:max-w-4xl max-h-[92dvh] bg-brand-field border-t-1.5 md:border-1.5 border-brand-line rounded-t-[20px] md:rounded-[20px] md:flex ${
          showGrid ? 'h-[92dvh] md:h-[min(600px,92dvh)] flex flex-col overflow-hidden' : 'overflow-y-auto'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="h-[5px] w-10 rounded-full bg-brand-line mx-auto my-2 flex-shrink-0 md:hidden" aria-hidden="true" />

        {showGrid ? (
          /* All photos: 3 columns on phones, 6 on desktop; a tap goes back to that photo */
          <div className="w-full flex-1 min-h-0 flex flex-col">
            <div className="flex items-center gap-2.5 px-4 pb-3 md:pt-3 border-b-1.5 border-brand-line">
              <button
                ref={backRef}
                onClick={closeGrid}
                aria-label={t.backToPhoto}
                className="grid place-items-center w-9 h-9 flex-shrink-0 rounded-card border-1.5 border-brand-line bg-white/[0.07] transition-colors duration-150 hover:border-brand-mint"
              >
                <ArrowIcon dir="left" className="w-[18px] h-[18px]" />
              </button>
              <div className="min-w-0">
                <h2 id="product-title" className="text-[22px] leading-none truncate">
                  {product.name}
                </h2>
                <p className="text-brand-lavender text-xs mt-0.5">
                  {t.photos(total)} · {t.gridHint}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label={t.close}
                className="ml-auto grid place-items-center w-9 h-9 flex-shrink-0 rounded-card border-1.5 border-brand-line bg-white/[0.07] text-xl leading-none transition-colors duration-150 hover:border-brand-mint"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto grid grid-cols-3 md:grid-cols-6 content-start gap-[3px] md:gap-1 p-[3px] md:p-1">
              {images.map((url, i) => (
                <button
                  key={url}
                  onClick={() => openPhoto(i)}
                  aria-label={t.imageOf(i + 1, total)}
                  className="relative aspect-square bg-brand-deep"
                >
                  <Image
                    src={sizedImage(url, GRID_WIDTH)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 150px"
                  />
                  {i === currentIndex && (
                    <span className="absolute inset-0 border-[3px] border-brand-mint" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
            <div className="md:hidden px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t-1.5 border-brand-line">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-main py-3">
                <WhatsAppMark />
                {t.askProduct}
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Gallery */}
            {product.cover ? (
              <div className="md:w-3/5 flex-shrink-0 md:bg-brand-deep">
                <div className="relative">
                  <div
                    key={product.id}
                    ref={galleryRef}
                    onScroll={onGalleryScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-brand-deep"
                  >
                    {images.map((url, i) => (
                      <div key={url} className="relative aspect-square w-full flex-none snap-center">
                        <Image
                          src={sizedImage(url, VIEWER_WIDTH)}
                          alt={`${product.name} - ${t.imageOf(i + 1, total)}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 60vw"
                          priority={i === 0}
                        />
                      </div>
                    ))}
                  </div>

                  {closeButton}

                  {hasMany && (
                    <>
                      {currentIndex > 0 && (
                        <button
                          onClick={() => goTo(currentIndex - 1)}
                          aria-label={t.previousImage}
                          className="hidden md:grid absolute left-3 top-1/2 -translate-y-1/2 place-items-center w-10 h-10 rounded-full border-1.5 border-brand-line bg-brand-deep/80 transition-colors duration-150 hover:border-brand-mint"
                        >
                          <ArrowIcon dir="left" />
                        </button>
                      )}
                      {currentIndex < images.length - 1 && (
                        <button
                          onClick={() => goTo(currentIndex + 1)}
                          aria-label={t.nextImage}
                          className="hidden md:grid absolute right-3 top-1/2 -translate-y-1/2 place-items-center w-10 h-10 rounded-full border-1.5 border-brand-line bg-brand-deep/80 transition-colors duration-150 hover:border-brand-mint"
                        >
                          <ArrowIcon dir="right" />
                        </button>
                      )}
                      <button
                        ref={photosRef}
                        onClick={() => setShowGrid(true)}
                        aria-label={t.seeAllPhotos(total)}
                        className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full border-1.5 border-brand-mint bg-brand-deep/85 px-2.5 py-1 text-xs font-extrabold text-brand-mint transition-colors duration-150 hover:bg-brand-deep"
                      >
                        <GridIcon className="w-3.5 h-3.5" />
                        {t.photos(total)}
                      </button>
                      <p className="sr-only" aria-live="polite">
                        {t.imageOf(currentIndex + 1, total)}
                      </p>
                    </>
                  )}
                </div>

                {/* Every photo as a thumbnail; swipe the row, tap one to show it */}
                {images.length > 1 && (
                  <div
                    ref={stripRef}
                    role="group"
                    aria-label={t.thumbnails}
                    className="relative flex gap-1.5 overflow-x-auto scrollbar-thin px-4 md:px-2.5 pt-2 md:pb-2"
                  >
                    {images.map((url, i) => (
                      <button
                        key={url}
                        onClick={() => goTo(i)}
                        aria-label={t.imageOf(i + 1, total)}
                        aria-current={i === currentIndex ? 'true' : undefined}
                        className={`relative flex-none w-[58px] h-[58px] rounded-[10px] overflow-hidden border-2 transition-opacity duration-150 ${
                          i === currentIndex ? 'border-brand-mint' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image src={sizedImage(url, ROW_WIDTH)} alt="" fill className="object-cover" sizes="58px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-coming-soon relative md:w-3/5 flex-shrink-0 aspect-[16/10] md:aspect-square grid place-items-center text-center px-6">
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/isotype-white.svg" alt="" className="w-[110px] h-auto opacity-35 mx-auto mb-2.5" />
                  <p className="font-display text-[22px] tracking-[0.02em]">{t.comingSoon}</p>
                  <p className="text-brand-lavender text-sm max-w-[250px] mx-auto">
                    {t.comingSoonText}
                  </p>
                </div>
                {closeButton}
              </div>
            )}

            {/* Info */}
            <div className="flex flex-col md:w-2/5 md:min-h-full">
              <div className="px-4 pt-3.5 md:p-5">
                <h2 id="product-title" className="text-[32px] leading-none">
                  {product.name}
                </h2>
                <span className="badge mt-2">{product.category}</span>
                {product.brand !== product.category && (
                  <p className="text-brand-lavender text-sm mt-2">
                    {t.brand}: <span className="text-white font-semibold">{product.brand}</span>
                  </p>
                )}
                {product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {tags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => onTagClick(tag)}
                        aria-label={t.searchTag(tag)}
                        className="text-xs text-brand-lavender border-1.5 border-brand-line rounded-full px-2 py-0.5 transition-colors duration-150 hover:border-brand-mint hover:text-white"
                      >
                        {tag}
                      </button>
                    ))}
                    {hiddenTags > 0 && !showAllTags && (
                      <button
                        onClick={() => setShowAllTags(true)}
                        aria-label={t.moreTags(hiddenTags)}
                        className="text-xs font-bold text-brand-mint border-1.5 border-brand-mint rounded-full px-2 py-0.5"
                      >
                        +{hiddenTags}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-auto flex flex-col gap-2.5 px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:p-5">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-main py-3">
                  <WhatsAppMark />
                  {t.askProduct}
                </a>
                <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <InstagramIcon className="w-[18px] h-[18px]" />
                  {t.seeInstagram}
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
