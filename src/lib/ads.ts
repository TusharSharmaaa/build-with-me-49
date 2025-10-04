// AdMob integration module with web fallback and frequency caps

interface AdConfig {
  appId: string;
  testMode: boolean;
}

interface AdPlacement {
  placement: 'listing' | 'search' | 'details';
}

interface RewardedOptions {
  onReward: () => void;
}

// AdMob ad unit IDs from environment (falls back to test IDs in dev)
const AD_UNITS = {
  appId: import.meta.env.VITE_ADMOB_APP_ID || 'ca-app-pub-3940256099942544~3347511713',
  banner: import.meta.env.VITE_ADMOB_BANNER_ID || 'ca-app-pub-3940256099942544/6300978111',
  interstitial: import.meta.env.VITE_ADMOB_INTERSTITIAL_ID || 'ca-app-pub-3940256099942544/1033173712',
  rewarded: import.meta.env.VITE_ADMOB_REWARDED_ID || 'ca-app-pub-3940256099942544/5224354917',
};

export function getAdUnitIds() {
  return AD_UNITS;
}

// Counter keys for localStorage
const STORAGE_KEYS = {
  detailViews: 'ad_detail_views_count',
  searchCount: 'ad_search_count',
  lastInterstitial: 'ad_last_interstitial_at',
  lastRewarded: 'ad_last_rewarded_at',
  testMode: 'ad_test_mode',
};

// Default frequency caps (can be overridden by Remote Config)
let adConfig = {
  interstitialEveryNDetails: 2,
  interstitialMinSeconds: 120,
  rewardedEveryNSearches: 10,
  rewardedMinSeconds: 300,
  bannersEnabled: true,
  interstitialEnabled: true,
  rewardedEnabled: true,
};

export function updateAdConfig(config: Partial<typeof adConfig>) {
  adConfig = { ...adConfig, ...config };
}

export function getAdConfig() {
  return adConfig;
}

export function initAds(config: AdConfig) {
  console.log('[Ads] Initializing with config:', config);
  localStorage.setItem(STORAGE_KEYS.testMode, String(config.testMode));
  
  // In production with Capacitor, this would initialize the native AdMob SDK
  // For now, this is a web fallback
  if (typeof window !== 'undefined' && (window as any).admob) {
    // Native AdMob SDK available
    (window as any).admob.start();
  }
}

export function showBanner({ placement }: AdPlacement): boolean {
  if (!adConfig.bannersEnabled) return false;
  
  console.log('[Ads] Banner requested for placement:', placement);
  
  // Web fallback: banners will be rendered as placeholder components
  // In native app, this would call AdMob SDK
  return true;
}

function getCounter(key: string): number {
  return parseInt(localStorage.getItem(key) || '0', 10);
}

function setCounter(key: string, value: number) {
  localStorage.setItem(key, String(value));
}

function incrementCounter(key: string): number {
  const newValue = getCounter(key) + 1;
  setCounter(key, newValue);
  return newValue;
}

function getTimestamp(key: string): number {
  return parseInt(localStorage.getItem(key) || '0', 10);
}

function setTimestamp(key: string) {
  localStorage.setItem(key, String(Date.now()));
}

export function trackDetailView() {
  incrementCounter(STORAGE_KEYS.detailViews);
}

export function trackSearch() {
  incrementCounter(STORAGE_KEYS.searchCount);
}

export function showInterstitialIfEligible(): boolean {
  if (!adConfig.interstitialEnabled) return false;
  
  const detailViews = getCounter(STORAGE_KEYS.detailViews);
  const lastShown = getTimestamp(STORAGE_KEYS.lastInterstitial);
  const now = Date.now();
  const secondsSinceLastAd = (now - lastShown) / 1000;
  
  // Check if we should show interstitial
  const shouldShow = 
    detailViews > 0 &&
    detailViews % adConfig.interstitialEveryNDetails === 0 &&
    secondsSinceLastAd >= adConfig.interstitialMinSeconds;
  
  if (shouldShow) {
    console.log('[Ads] Showing interstitial ad');
    setTimestamp(STORAGE_KEYS.lastInterstitial);
    
    // In native app, this would show the actual ad
    if (typeof window !== 'undefined' && (window as any).admob) {
      (window as any).admob.showInterstitial();
    }
    
    return true;
  }
  
  return false;
}

export function showRewardedIfEligible({ onReward }: RewardedOptions): boolean {
  if (!adConfig.rewardedEnabled) return false;
  
  const searchCount = getCounter(STORAGE_KEYS.searchCount);
  const lastShown = getTimestamp(STORAGE_KEYS.lastRewarded);
  const now = Date.now();
  const secondsSinceLastAd = (now - lastShown) / 1000;
  
  // Check if we should show rewarded ad
  const shouldShow = 
    searchCount > 0 &&
    searchCount % adConfig.rewardedEveryNSearches === 0 &&
    secondsSinceLastAd >= adConfig.rewardedMinSeconds;
  
  if (shouldShow) {
    console.log('[Ads] Showing rewarded ad');
    setTimestamp(STORAGE_KEYS.lastRewarded);
    
    // In native app, this would show the actual ad
    if (typeof window !== 'undefined' && (window as any).admob) {
      (window as any).admob.showRewarded((rewarded: boolean) => {
        if (rewarded) onReward();
      });
    } else {
      // Web fallback - simulate reward after delay
      setTimeout(() => onReward(), 100);
    }
    
    return true;
  }
  
  return false;
}

export function resetAdCounters() {
  setCounter(STORAGE_KEYS.detailViews, 0);
  setCounter(STORAGE_KEYS.searchCount, 0);
}

export function getAdStats() {
  return {
    detailViews: getCounter(STORAGE_KEYS.detailViews),
    searchCount: getCounter(STORAGE_KEYS.searchCount),
    lastInterstitial: getTimestamp(STORAGE_KEYS.lastInterstitial),
    lastRewarded: getTimestamp(STORAGE_KEYS.lastRewarded),
  };
}
