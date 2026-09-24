type AnalyticsParameter = string | number | boolean | undefined;

const MEASUREMENT_ID = "G-N0ZHLVVPGC";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function initializeAnalytics() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID);
}

export function trackEvent(
  name: string,
  parameters: Record<string, AnalyticsParameter> = {},
) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, parameters);
}
