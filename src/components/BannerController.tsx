import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { showBanner, hideBanner } from '../lib/ads';

/**
 * Route-aware banner policy WITHOUT react-router.
 * Watches window.location and history changes.
 * Shows banner only on detail pages: path containing "/tool/" (adjust if needed).
 */
export default function BannerController() {
  useEffect(() => {
    if (Capacitor.getPlatform() === 'web') return;

    const isDetails = () => window.location.pathname.includes('/tool/'); // <-- change if your route differs

    const apply = async () => {
      try {
        if (isDetails()) {
          await showBanner();
        } else {
          await hideBanner();
        }
      } catch {
        /* noop */
      }
    };

    // Run once on mount
    apply();

    // Listen to navigation changes
    const onPop = () => apply();
    const onHash = () => apply();

    // Monkey-patch pushState/replaceState to detect SPA nav
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    (history.pushState as any) = function (...args: any[]) {
      const r = origPush.apply(this, args as any);
      apply();
      return r;
    };
    (history.replaceState as any) = function (...args: any[]) {
      const r = origReplace.apply(this, args as any);
      apply();
      return r;
    };

    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onHash);

    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onHash);
      (history.pushState as any) = origPush;
      (history.replaceState as any) = origReplace;
      hideBanner().catch(() => {});
    };
  }, []);

  return null;
}
