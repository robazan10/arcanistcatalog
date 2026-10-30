'use client';

import Script from 'next/script';
import { UMAMI } from '@/lib/config';
import { trackPageView } from '@/lib/analytics';

// Umami, counting only on the live domain; see docs/analytics.md
export default function Analytics() {
  return (
    <Script
      src={UMAMI.script}
      data-website-id={UMAMI.websiteId}
      data-domains={UMAMI.domain}
      data-auto-track="false"
      strategy="afterInteractive"
      onLoad={trackPageView}
    />
  );
}
