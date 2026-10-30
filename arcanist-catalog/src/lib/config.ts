export const SOCIAL = {
  whatsapp: 'https://wa.me/50372364700',
  instagram: 'https://www.instagram.com/arcanistdice',
};

export const SITE = {
  name: "Arcanist's Dice",
  url: 'https://www.arcanistsdice.com',
};

export function whatsappLink(message: string): string {
  return `${SOCIAL.whatsapp}?text=${encodeURIComponent(message)}`;
}

// Usage analytics (docs/analytics.md). The website ID is public; only the live domain is counted.
export const UMAMI = {
  script: 'https://cloud.umami.is/script.js',
  websiteId: '2c846acd-c1d8-4391-84a0-a0205fb5da64',
  domain: 'www.arcanistsdice.com',
};
