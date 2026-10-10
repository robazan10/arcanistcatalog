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
