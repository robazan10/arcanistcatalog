'use client';

import { useEffect, useMemo, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import type { Dictionary } from '@/i18n/dictionaries';
import { VIEWER_WIDTH, ZOOM_WIDTH, sizedImage } from '@/lib/images';
import { ZoomIcon } from './icons';

interface Props {
  images: string[];
  index: number;
  alt: string;
  // The photo on screen when it closes, so the product view can return to it
  onClose: (index: number) => void;
  t: Dictionary;
}

// The "Puedes hacer zoom" hint shows once per phone
const HINT_KEY = 'zoom-hint-seen';

// Full-screen photos with zoom, loaded only when a visitor opens it (docs/ui.md, "Full-screen viewer")
export default function PhotoViewer({ images, index, alt, onClose, t }: Props) {
  const [current, setCurrent] = useState(index);
  // Large copies Google refused (429): those photos fall back to the product view's size
  const [failed, setFailed] = useState<Set<string>>(new Set());
  const [hint, setHint] = useState(false);
  const touch = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches, []);

  // Try the large copy of this photo and its neighbors first; one that fails uses the smaller copy
  useEffect(() => {
    for (const url of images.slice(Math.max(current - 1, 0), current + 2)) {
      const probe = new Image();
      probe.onerror = () => setFailed(prev => new Set(prev).add(url));
      probe.src = sizedImage(url, ZOOM_WIDTH);
    }
  }, [images, current]);

  useEffect(() => {
    if (!touch) return;
    try {
      if (localStorage.getItem(HINT_KEY)) return;
      localStorage.setItem(HINT_KEY, '1');
    } catch {
      // Storage blocked: show the hint anyway
    }
    setHint(true);
    const timer = setTimeout(() => setHint(false), 3500);
    return () => clearTimeout(timer);
  }, [touch]);

  // Kept stable: the lightbox starts over at `index` whenever it gets a new list of slides
  const slides = useMemo(
    () => images.map(url => ({ src: sizedImage(url, failed.has(url) ? VIEWER_WIDTH : ZOOM_WIDTH), alt })),
    [images, failed, alt]
  );
  const hasMany = images.length > 1;

  return (
    <Lightbox
      open
      close={() => onClose(current)}
      slides={slides}
      index={current}
      plugins={[Zoom]}
      carousel={{ finite: true, preload: 1 }}
      controller={{ closeOnBackdropClick: false }}
      zoom={{ scrollToZoom: true, doubleClickMaxStops: 2 }}
      on={{ view: ({ index: i }) => setCurrent(i) }}
      className="photo-viewer"
      labels={{
        Close: t.close,
        Previous: t.previousImage,
        Next: t.nextImage,
        'Zoom in': t.zoomIn,
        'Zoom out': t.zoomOut,
        Lightbox: t.photoViewer,
        'Photo gallery': t.photoViewer,
        '{index} of {total}': t.imageOfTemplate,
      }}
      render={{
        // Phones zoom with the fingers and swipe; the buttons are for the mouse
        buttonZoom: touch ? () => null : undefined,
        buttonPrev: touch || !hasMany ? () => null : undefined,
        buttonNext: touch || !hasMany ? () => null : undefined,
        controls: () => (
          <>
            {hasMany && (
              <span className="absolute top-4 left-4 rounded-full border border-brand-line bg-brand-deep/85 px-3 py-1 text-[13px] font-extrabold" aria-hidden="true">
                {current + 1} / {images.length}
              </span>
            )}
            {hint && (
              <span
                role="status"
                className="absolute left-1/2 -translate-x-1/2 bottom-[max(2rem,env(safe-area-inset-bottom))] flex items-center gap-1.5 whitespace-nowrap rounded-full border-1.5 border-brand-line bg-brand-deep/90 px-3.5 py-1.5 text-[13px] font-bold"
              >
                <ZoomIcon className="w-4 h-4" />
                {t.zoomHint}
              </span>
            )}
          </>
        ),
      }}
    />
  );
}
