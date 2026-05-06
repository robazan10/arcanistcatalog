'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { SOCIAL } from '@/lib/config';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex(i => Math.min(i + 1, product.images.length - 1));
      if (e.key === 'ArrowLeft') setCurrentIndex(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, onClose]);

  if (!product) return null;

  const currentImage = product.images[currentIndex];
  const whatsappUrl = `${SOCIAL.whatsapp}?text=${encodeURIComponent(
    `Hola! Me interesa el producto: ${product.name}`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-arcane-card border border-arcane-border rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-arcane-border">
          <div>
            <h2 className="font-cinzel font-bold text-xl text-white">{product.name}</h2>
            <p className="text-teal text-sm mt-0.5">{product.category}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="ml-4 text-silver/60 hover:text-white text-3xl leading-none transition-colors flex-shrink-0"
          >
            &times;
          </button>
        </div>

        <div className="md:flex">
          {/* Galeria */}
          <div className="md:w-3/5">
            <div className="relative aspect-square bg-primary-dark">
              {currentImage && (
                <Image
                  src={currentImage.url}
                  alt={`${product.name} - imagen ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              )}
              {product.images.length > 1 && (
                <>
                  {currentIndex > 0 && (
                    <button
                      onClick={() => setCurrentIndex(i => i - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors text-lg"
                    >
                      &#8592;
                    </button>
                  )}
                  {currentIndex < product.images.length - 1 && (
                    <button
                      onClick={() => setCurrentIndex(i => i + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors text-lg"
                    >
                      &#8594;
                    </button>
                  )}
                  <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {currentIndex + 1} / {product.images.length}
                  </span>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {product.images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={img.filename}
                    onClick={() => setCurrentIndex(i)}
                    className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === currentIndex
                        ? 'border-teal'
                        : 'border-arcane-border hover:border-silver/40'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`Miniatura ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informacion */}
          <div className="md:w-2/5 p-5 flex flex-col gap-5 border-t md:border-t-0 md:border-l border-arcane-border">
            <div>
              <p className="text-silver/50 text-xs uppercase tracking-widest mb-1">Marca</p>
              <p className="text-white font-medium">{product.brand}</p>
            </div>

            <div>
              <p className="text-silver/50 text-xs uppercase tracking-widest mb-2">Etiquetas</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-primary/30 text-silver px-3 py-1 rounded-full border border-arcane-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4 flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Consultar en WhatsApp
              </a>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full border border-arcane-border hover:border-silver/40 text-silver hover:text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Ver en Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
