# AdMob Setup Guide

This guide will help you integrate your real AdMob account with the AI Tools List app.

## Prerequisites

✅ You mentioned you already have an AdMob account set up
✅ Ads are currently configured but using **test IDs** (placeholders)
✅ Duplicates removed from database

## 🎯 What's Already Done

The app is pre-configured with:
- ✅ Banner ads (shown on tool listings and search results)
- ✅ Interstitial ads (shown after viewing 2 tool details)
- ✅ Rewarded video ads (shown after 10 searches to unlock bonus tools)
- ✅ Ad frequency caps to prevent ad fatigue
- ✅ Analytics tracking for ad impressions

## 📋 Step-by-Step Setup

### 1. Get Your AdMob Ad Unit IDs

1. Go to [AdMob Console](https://apps.admob.com)
2. Select your app (or create one if you haven't)
3. Create ad units for each type:

#### Create Banner Ad Unit
- Click **"Ad units"** → **"Add ad unit"**
- Select **"Banner"**
- Name it: `AI Tools List - Banner`
- Copy the **Ad unit ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY`)

#### Create Interstitial Ad Unit
- Click **"Add ad unit"** again
- Select **"Interstitial"**
- Name it: `AI Tools List - Interstitial`
- Copy the **Ad unit ID**

#### Create Rewarded Video Ad Unit
- Click **"Add ad unit"** again
- Select **"Rewarded"**
- Name it: `AI Tools List - Rewarded Video`
- Copy the **Ad unit ID**

#### Get Your App ID
- In AdMob, go to **"App settings"**
- Copy your **AdMob App ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX~ZZZZZZZZZZ`)

### 2. Configure Your Ad IDs in Lovable

The secrets you just set up need to be filled with your real AdMob IDs:

<lov-actions>
  <lov-open-backend>Open Backend to Configure Secrets</lov-open-backend>
</lov-actions>

Navigate to **Edge Functions > Secrets** and update these values:

| Secret Name | Your Value | Example |
|-------------|------------|---------|
| `ADMOB_APP_ID` | Your App ID | `ca-app-pub-1234567890123456~1234567890` |
| `ADMOB_BANNER_ID` | Your Banner Ad Unit ID | `ca-app-pub-1234567890123456/1234567890` |
| `ADMOB_INTERSTITIAL_ID` | Your Interstitial Ad Unit ID | `ca-app-pub-1234567890123456/0987654321` |
| `ADMOB_REWARDED_ID` | Your Rewarded Video Ad Unit ID | `ca-app-pub-1234567890123456/1122334455` |

### 3. Test Your Ads

**Important:** During development, ads will show as placeholders in the web preview. Real ads only work in the native Android app built with Capacitor.

To build the Android app:
1. Follow the deployment guide in `DEPLOYMENT_GUIDE.md`
2. Build APK/AAB with Capacitor
3. Install on a real device (not emulator)
4. Test each ad type:
   - Banner: Opens any category page
   - Interstitial: View 2 different tool details
   - Rewarded: Search 10 times

### 4. Ad Placement Summary

| Ad Type | Location | Trigger |
|---------|----------|---------|
| **Banner** | Bottom of Tool Listings & Search | Always visible |
| **Interstitial** | After Tool Detail Views | Every 2nd tool view (minimum 2 min gap) |
| **Rewarded Video** | Premium Tools Page | After 10 searches (minimum 5 min gap) |

### 5. Ad Revenue Optimization Tips

📊 **Best Practices:**
- Keep interstitial frequency at 2-3 views (set in `src/lib/ads.ts`)
- Don't show interstitials on first visit (wait for user engagement)
- Use rewarded ads for premium features to increase completion rate
- Monitor eCPM in AdMob dashboard
- Test different ad frequencies based on user feedback

🎯 **Current Settings** (in `src/lib/ads.ts`):
```typescript
interstitialEveryNDetails: 2,  // Show after every 2 tool details
interstitialMinSeconds: 120,   // Minimum 2 minutes between interstitials
rewardedEveryNSearches: 10,    // Offer rewarded video after 10 searches
rewardedMinSeconds: 300,       // Minimum 5 minutes between rewarded ads
```

### 6. Monitor Performance

Once live, track your ad performance:
- **AdMob Dashboard**: Revenue, eCPM, fill rate, impressions
- **App Analytics**: User sessions, ad click-through rate
- **User Feedback**: Watch for complaints about ad frequency

## 🚨 Common Issues

### Issue: Ads not showing in web preview
**Solution:** This is normal. Real ads only work in the native Android app. Web preview shows placeholders.

### Issue: "Ad failed to load" error
**Solution:** 
1. Verify your Ad Unit IDs are correct in secrets
2. Ensure your AdMob account is approved (can take 1-2 days)
3. Check that you have a payment method set up in AdMob

### Issue: Low ad fill rate
**Solution:**
1. Enable mediation in AdMob for better fill
2. Add more ad networks (Facebook Audience Network, Unity Ads)
3. Target specific countries with higher fill rates

## 📱 Native App Integration

For the ads to work in production, you need to:

1. **Build Android App** using Capacitor (see `DEPLOYMENT_GUIDE.md`)
2. **Install AdMob Plugin**:
   ```bash
   npm install @capacitor-community/admob
   npx cap sync
   ```
3. **Update `capacitor.config.ts`** with your App ID
4. **Build & Deploy** to Google Play

## ✅ Next Steps

1. ✅ Set your real AdMob IDs in the secrets (button above)
2. ✅ Test ad frequency by browsing the app
3. ✅ Build Android app with Capacitor
4. ✅ Submit to Google Play
5. ✅ Monitor AdMob dashboard for revenue

---

## 📞 Need Help?

- **AdMob Help**: https://support.google.com/admob
- **Capacitor Docs**: https://capacitorjs.com/docs
- **This Project**: Check `DEPLOYMENT_GUIDE.md` for build instructions

## 🎉 You're All Set!

Your app now has:
- ✅ 60+ AI tools across 23+ categories
- ✅ Daily Life Tools section (PDF, image creation, video tools, etc.)
- ✅ AdMob integration ready to generate revenue
- ✅ No duplicate tools
- ✅ Premium features unlocked by rewarded ads

Good luck with your launch! 🚀
