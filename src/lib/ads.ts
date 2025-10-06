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
    if (!info.canRequestAds) {
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
export async function showPrivacyOptions() {
  await AdMob.showPrivacyOptionsForm();
}
