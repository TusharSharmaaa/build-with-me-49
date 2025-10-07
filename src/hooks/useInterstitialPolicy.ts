import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob } from '@capacitor-community/admob';

const KEY_VIEWS = 'detail_views_count';
const KEY_LAST_SHOW = 'interstitial_last_show';
const KEY_SESSION_START = 'session_start';

function now() { return Date.now(); }

function getNumber(key: string, fallback = 0) {
  const v = Number(localStorage.getItem(key));
  return Number.isFinite(v) ? v : fallback;
}
function setNumber(key: string, val: number) {
  localStorage.setItem(key, String(val));
}

export function bootSessionClock() {
  if (!localStorage.getItem(KEY_SESSION_START)) {
    setNumber(KEY_SESSION_START, now());
  }
}

export function useInterstitialPolicy() {
  useEffect(() => {
    if (Capacitor.getPlatform() === 'web') return;

    // bump detail view count
    const views = getNumber(KEY_VIEWS) + 1;
    setNumber(KEY_VIEWS, views);

    // rules
    const MIN_SESSION_MS = 60_000;      // 60s after app start
    const COOLDOWN_MS    = 120_000;     // 2 minutes between interstitials
    const EVERY_N        = 2;           // show on every 2nd detail view

    const sessionStart = getNumber(KEY_SESSION_START, now());
    const sinceStart   = now() - sessionStart;
    const lastShow     = getNumber(KEY_LAST_SHOW, 0);
    const sinceLast    = now() - lastShow;

    const shouldShow =
      views % EVERY_N === 0 &&
      sinceStart >= MIN_SESSION_MS &&
      sinceLast  >= COOLDOWN_MS;

    (async () => {
      try {
        if (shouldShow) {
          await AdMob.prepareInterstitial({ adId: import.meta.env.VITE_ADMOB_INTERSTITIAL_ID });
          await AdMob.showInterstitial();
          setNumber(KEY_LAST_SHOW, now());
        }
      } catch (_) {
        /* ignore failures; continue UX */
      }
    })();

    // no cleanup needed
  }, []);
}
