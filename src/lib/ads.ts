import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
  InterstitialAdPluginEvents,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';

const IS_PROD = import.meta.env.VITE_ADS_MODE === 'prod';

const IDS = {
  app: import.meta.env.VITE_ADMOB_APP_ID,
  banner: import.meta.env.VITE_ADMOB_BANNER_ID,
  interstitial: import.meta.env.VITE_ADMOB_INTERSTITIAL_ID,
  rewarded: import.meta.env.VITE_ADMOB_REWARDED_ID,
};

// Initialize AdMob + handle consent (UMP)
export async function initAds() {
  await AdMob.initialize();

  // Ask/refresh consent each launch; show form if needed
  try {
    let info = await AdMob.requestConsentInfo();
    // Use the correct property from AdmobConsentInfo, e.g., isConsentFormAvailable
    if (info.isConsentFormAvailable) {
      info = await AdMob.showConsentForm();
    }
    return info;
  } catch {
    // If consent flow isn't required/available, continue gracefully
    return { canRequestAds: true };
  }
}

// Show/hide Banner
export async function showBanner() {
  const opts: BannerAdOptions = {
    adId: IDS.banner,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
  };
  await AdMob.showBanner(opts);
}

export async function hideBanner() {
  await AdMob.hideBanner();
}

// Interstitial
export async function showInterstitial() {
  await AdMob.prepareInterstitial({ adId: IDS.interstitial });
  await AdMob.showInterstitial();
}

// Rewarded
export async function showRewarded() {
  await AdMob.prepareRewardVideoAd({ adId: IDS.rewarded });
  await AdMob.showRewardVideoAd();
}

// Let users revisit privacy options (settings screen hook)
// The showPrivacyOptionsForm method does not exist in the AdMob plugin.
// You may implement your own privacy options logic here or leave this function as a placeholder.
export async function showPrivacyOptions() {
  // TODO: Implement privacy options form if supported by the plugin or handle accordingly.
}
import { Capacitor } from '@capacitor/core';

export function attachBannerListener() {
  if (Capacitor.getPlatform() === 'web') return;

  const setAdSafe = (px: number) => {
    document.documentElement.style.setProperty('--ad-safe', `${px}px`);
  };

  window.addEventListener(BannerAdPluginEvents.Loaded, () => {
    setAdSafe(60); // default adaptive height; will be corrected by SizeChanged
  });

  window.addEventListener(BannerAdPluginEvents.SizeChanged, (e: any) => {
    const h = e?.size?.height || 60;
    setAdSafe(h);
  });

  window.addEventListener(BannerAdPluginEvents.FailedToLoad, () => {
    setAdSafe(0);
  });

  window.addEventListener(BannerAdPluginEvents.Closed, () => {
    setAdSafe(0);
  });
}
