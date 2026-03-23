type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;
let clickTrackingBound = false;
let pageTrackingBound = false;

function getGaId(): string | null {
  const gaId = (import.meta.env.VITE_GA_ID as string | undefined)?.trim();
  return gaId ? gaId : null;
}

function isEnabled(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function' && !!getGaId();
}

function sanitizeLabel(input: string | null | undefined): string | undefined {
  if (!input) {
    return undefined;
  }

  const normalized = input.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return undefined;
  }

  return normalized.slice(0, 80);
}

function getElementLabel(element: Element): string | undefined {
  return (
    sanitizeLabel(element.getAttribute('data-analytics')) ||
    sanitizeLabel(element.getAttribute('aria-label')) ||
    sanitizeLabel(element.getAttribute('title')) ||
    sanitizeLabel((element as HTMLElement).innerText)
  );
}

export function initAnalytics() {
  if (initialized || typeof document === 'undefined') {
    return;
  }

  const gaId = getGaId();
  if (!gaId) {
    initialized = true;
    return;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  window.gtag = (...args: unknown[]) => {
    window.dataLayer.push(args);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', gaId, { send_page_view: false });

  initialized = true;
}

export function trackEvent(name: string, params?: EventParams) {
  if (!isEnabled()) {
    return;
  }
  window.gtag?.('event', name, params || {});
}

export function trackPageView(path?: string) {
  if (!isEnabled()) {
    return;
  }

  const currentPath = path || `${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.gtag?.('event', 'page_view', {
    page_path: currentPath,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function setupAutoPageViewTracking() {
  if (pageTrackingBound || typeof window === 'undefined') {
    return;
  }

  const emit = () => {
    trackPageView();
  };

  emit();
  window.addEventListener('popstate', emit);
  window.addEventListener('hashchange', emit);
  pageTrackingBound = true;
}

export function setupGlobalClickTracking() {
  if (clickTrackingBound || typeof document === 'undefined') {
    return;
  }

  document.addEventListener(
    'click',
    (event) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      const element = target.closest('button, a, [role="button"], [data-analytics]');
      if (!element) {
        return;
      }

      const anchor = element.closest('a');
      const href = anchor?.href;
      const outbound = !!href && !href.startsWith(window.location.origin);

      trackEvent('ui_click', {
        label: getElementLabel(element),
        element_tag: element.tagName.toLowerCase(),
        element_id: element.id || undefined,
        outbound,
        href,
      });
    },
    true,
  );

  clickTrackingBound = true;
}
