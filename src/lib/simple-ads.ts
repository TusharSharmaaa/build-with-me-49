// Simple ad placeholder system with localStorage counters

const STORAGE_KEYS = {
  detailViews: "ad_detail_views",
  lastInterstitial: "ad_last_interstitial",
  searchCount: "ad_search_count",
  testMode: "ad_test_mode",
  personalized: "ad_personalized",
};

// Track tool detail view for interstitial logic
export function trackDetailView() {
  const count = parseInt(localStorage.getItem(STORAGE_KEYS.detailViews) || "0") + 1;
  localStorage.setItem(STORAGE_KEYS.detailViews, count.toString());
  console.log("[Ads] Detail view tracked:", count);
}

// Check if interstitial should show (every 2 views, 120s cooldown)
export function shouldShowInterstitial(): boolean {
  const count = parseInt(localStorage.getItem(STORAGE_KEYS.detailViews) || "0");
  const lastShown = parseInt(localStorage.getItem(STORAGE_KEYS.lastInterstitial) || "0");
  const now = Date.now();
  const cooldownMs = 120000; // 120 seconds

  if (count >= 2 && now - lastShown >= cooldownMs) {
    localStorage.setItem(STORAGE_KEYS.detailViews, "0");
    localStorage.setItem(STORAGE_KEYS.lastInterstitial, now.toString());
    return true;
  }
  return false;
}

// Track search for rewarded logic
export function trackSearch() {
  const count = parseInt(localStorage.getItem(STORAGE_KEYS.searchCount) || "0") + 1;
  localStorage.setItem(STORAGE_KEYS.searchCount, count.toString());
  console.log("[Ads] Search tracked:", count);
}

// Simulated rewarded ad (3 second delay)
export async function showRewardedAd(): Promise<boolean> {
  console.log("[Ads] Showing rewarded ad...");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("[Ads] Rewarded ad complete");
      resolve(true);
    }, 3000);
  });
}

// Settings - Test ads always enabled by default for production
export function getTestMode(): boolean {
  const stored = localStorage.getItem(STORAGE_KEYS.testMode);
  if (stored === null) {
    localStorage.setItem(STORAGE_KEYS.testMode, "true");
    return true;
  }
  return stored === "true";
}

export function setTestMode(enabled: boolean) {
  localStorage.setItem(STORAGE_KEYS.testMode, enabled.toString());
}
