// Every event the site counts goes through track(); the list and its meaning are in docs/analytics.md.
// Without the Umami script (previews, local builds) it does nothing.

type EventData = Record<string, string | number>;

declare global {
  interface Window {
    umami?: { track: (event?: string, data?: EventData) => void };
  }
}

export function track(event: string, data?: EventData) {
  try {
    window.umami?.track(event, data);
  } catch {
    // Analytics never breaks the page
  }
}

// One page view per page load (auto-tracking is off: the site changes the address on every search and product)
export function trackPageView() {
  try {
    window.umami?.track();
  } catch {
    // Analytics never breaks the page
  }
}
