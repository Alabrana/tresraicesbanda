const GTM_ID = 'GTM-TM4VWKFF';
const CONSENT_STORAGE_KEY = 'tres-raices:analytics-consent:v1';
const ALLOWED_HOSTNAMES = new Set(['tresraicesbanda.cl', 'www.tresraicesbanda.cl']);

type ConsentPreference = 'accepted' | 'rejected' | null;
type GtagArguments = IArguments;

interface AnalyticsConsentApi {
  getPreference: () => ConsentPreference;
  accept: () => void;
  reject: () => void;
}

declare global {
  interface Window {
    dataLayer?: GtagArguments[];
    gtag?: (...args: unknown[]) => void;
    tresRaicesAnalytics?: AnalyticsConsentApi;
  }
}

function getPreference(): ConsentPreference {
  try {
    const preference = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return preference === 'accepted' || preference === 'rejected' ? preference : null;
  } catch {
    return null;
  }
}

function savePreference(preference: Exclude<ConsentPreference, null>) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, preference);
  } catch {
    // The preference remains valid for the current page when storage is unavailable.
  }
}

function canLoadGoogleTag() {
  return import.meta.env.PROD && ALLOWED_HOSTNAMES.has(window.location.hostname);
}

function loadGoogleTag() {
  if (!canLoadGoogleTag() || document.querySelector(`script[data-gtm-id="${GTM_ID}"]`)) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(..._args: unknown[]) {
    window.dataLayer?.push(arguments);
  };

  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
  });
  window.gtag('js', new Date());

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  script.dataset.gtmId = GTM_ID;
  document.head.append(script);
}

function analyticsCookieNames() {
  return document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0]?.trim())
    .filter((name): name is string => Boolean(name))
    .filter((name) => /^(?:_ga(?:_|$)|_gid$|_gat(?:_|$)|_gac_|_gaexp$|__utm)/.test(name));
}

function cookiePaths() {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const paths = new Set(['/']);

  for (let index = 1; index <= segments.length; index += 1) {
    paths.add(`/${segments.slice(0, index).join('/')}`);
  }

  return paths;
}

function deleteAccessibleAnalyticsCookies() {
  const domains = new Set(['', window.location.hostname, `.${window.location.hostname}`, '.tresraicesbanda.cl']);

  for (const name of analyticsCookieNames()) {
    for (const path of cookiePaths()) {
      for (const domain of domains) {
        const domainAttribute = domain ? `; Domain=${domain}` : '';
        document.cookie = `${name}=; Max-Age=0; Path=${path}${domainAttribute}; SameSite=Lax`;
      }
    }
  }
}

function rejectAnalytics() {
  const googleTagWasLoaded = Boolean(document.querySelector(`script[data-gtm-id="${GTM_ID}"]`));

  if (window.gtag) {
    window.gtag('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
    });
  }

  savePreference('rejected');
  deleteAccessibleAnalyticsCookies();

  // A reload prevents an already evaluated GTM container from sending more hits.
  if (googleTagWasLoaded) {
    window.location.reload();
  }
}

window.tresRaicesAnalytics = {
  getPreference,
  accept() {
    savePreference('accepted');
    loadGoogleTag();
  },
  reject: rejectAnalytics,
};

if (getPreference() === 'accepted') {
  loadGoogleTag();
}

