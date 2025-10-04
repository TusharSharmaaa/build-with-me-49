# 📱 Android App Build Guide

This guide will help you build the **AI Tools List** native Android app using Capacitor.

## Prerequisites

Before you start, make sure you have:
- ✅ A computer (Windows, Mac, or Linux)
- ✅ Node.js installed (v16 or higher)
- ✅ Android Studio installed
- ✅ Java Development Kit (JDK) 17+
- ✅ Your AdMob IDs configured in Lovable Cloud

## 🚀 Quick Start (Step-by-Step)

### Step 1: Export Project to GitHub

1. Click the **GitHub** button in the top-right of Lovable
2. Click **"Export to GitHub"**
3. Create a new repository (e.g., `ai-tools-list`)
4. Wait for the export to complete

### Step 2: Clone Project to Your Computer

Open terminal/command prompt and run:

```bash
git clone https://github.com/YOUR_USERNAME/ai-tools-list.git
cd ai-tools-list
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Add Capacitor Dependencies

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor-community/admob
```

### Step 5: Initialize Capacitor (Already Done!)

The `capacitor.config.ts` file is already configured with:
- **App ID**: `app.lovable.6d6ef95b79434044814ce44ec5423c6d`
- **App Name**: `AI Tools List`
- **Server URL**: Hot-reload from Lovable preview

### Step 6: Add Android Platform

```bash
npx cap add android
```

This creates an `android/` folder with the native Android project.

### Step 7: Build Web Assets

```bash
npm run build
```

### Step 8: Sync to Android

```bash
npx cap sync android
```

This copies the web build and plugins to the Android project.

### Step 9: Configure AdMob in Android

1. Open `android/app/src/main/AndroidManifest.xml`
2. Add your AdMob App ID (replace with your real ID from AdMob console):

```xml
<manifest>
  <application>
    <!-- Add this line inside <application> -->
    <meta-data
      android:name="com.google.android.gms.ads.APPLICATION_ID"
      android:value="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"/>
  </application>
</manifest>
```

### Step 10: Open in Android Studio

```bash
npx cap open android
```

This opens Android Studio with your project.

### Step 11: Build APK

In Android Studio:

1. **Wait for Gradle sync** to complete (bottom status bar)
2. **Build > Build Bundle(s) / APK(s) > Build APK(s)**
3. Wait for build to complete (~2-5 minutes first time)
4. Click **"locate"** when the build finishes
5. Find your APK in: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 12: Install on Your Phone

**Option A - USB Cable:**
1. Enable **Developer Options** on your Android phone:
   - Go to **Settings > About Phone**
   - Tap **Build Number** 7 times
2. Enable **USB Debugging** in **Settings > Developer Options**
3. Connect phone to computer via USB
4. In Android Studio, click the **Run** button (green play icon)
5. Select your device from the list

**Option B - Install APK Directly:**
1. Copy `app-debug.apk` to your phone
2. Open file on phone and click **Install**
3. Allow installation from unknown sources if prompted

## 🎯 Testing the App

Once installed, test:

1. ✅ Browse categories and tools
2. ✅ Search for tools
3. ✅ View tool details
4. ✅ **Banner ads** appear at bottom of listings
5. ✅ **Interstitial ad** shows after viewing 2 tools
6. ✅ **Rewarded video** offered after 10 searches
7. ✅ Sign up / Login with email or Google
8. ✅ Save favorites
9. ✅ Leave reviews

## 🔥 Hot Reload During Development

Your app is configured to load directly from the Lovable preview URL, so changes you make in Lovable will instantly reflect in the app!

To disable this (for production):
1. Comment out the `server` section in `capacitor.config.ts`
2. Run `npm run build && npx cap sync`

## 📦 Building for Production (Google Play)

When you're ready to publish:

### Step 1: Generate Signing Key

```bash
keytool -genkey -v -keystore my-release-key.keystore -alias ai-tools-list -keyalg RSA -keysize 2048 -validity 10000
```

Save this file safely! You'll need it for every update.

### Step 2: Configure Signing in Android Studio

1. **Build > Generate Signed Bundle / APK**
2. Choose **Android App Bundle** (AAB)
3. Select your keystore file
4. Enter keystore password and key password
5. Click **Next > Finish**
6. Find your AAB in: `android/app/release/app-release.aab`

### Step 3: Update AdMob to Production IDs

Replace test IDs with your real AdMob IDs in Lovable Cloud secrets:

<lov-actions>
  <lov-open-backend>Update AdMob IDs</lov-open-backend>
</lov-actions>

### Step 4: Disable Hot Reload

In `capacitor.config.ts`, remove or comment the `server` section:

```typescript
const config: CapacitorConfig = {
  appId: 'app.lovable.6d6ef95b79434044814ce44ec5423c6d',
  appName: 'AI Tools List',
  webDir: 'dist',
  // server: {  // Comment this out for production
  //   url: 'https://...',
  //   cleartext: true
  // },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};
```

Then rebuild:

```bash
npm run build
npx cap sync android
```

### Step 5: Upload to Google Play Console

1. Create a Google Play Developer account ($25 one-time fee)
2. **Create app** in Play Console
3. Upload your signed AAB
4. Fill out store listing:
   - **Title**: AI Tools List - Free AI Tools Directory
   - **Short description**: Discover 60+ free AI tools for your profession
   - **Full description**: (See `DEPLOYMENT_GUIDE.md`)
   - **App category**: Tools
   - **Content rating**: Everyone
5. Add screenshots (4-8 required)
6. Set up pricing (Free)
7. Submit for review (1-3 days)

## 🐛 Troubleshooting

### Build Errors

**"SDK location not found"**
- Create `android/local.properties` with:
  ```
  sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
  ```

**"Gradle sync failed"**
- In Android Studio: **File > Invalidate Caches / Restart**
- Try `cd android && ./gradlew clean`

**"Unable to resolve dependency"**
- Check your internet connection
- Try: `cd android && ./gradlew --refresh-dependencies`

### AdMob Issues

**"Ads not showing"**
- Make sure you're using your REAL AdMob IDs
- AdMob account must be approved (takes 1-2 days)
- Test ads won't show in production builds

**"App crashes when showing ad"**
- Verify AdMob App ID in AndroidManifest.xml
- Check if @capacitor-community/admob is installed

### Hot Reload Not Working

- Make sure `server.url` in capacitor.config.ts points to your preview URL
- Try rebuilding: `npm run build && npx cap sync`

## 📊 Monitoring

After publishing:

- **Google Play Console**: Downloads, crashes, ratings
- **AdMob Dashboard**: Revenue, impressions, eCPM
- **Lovable Cloud**: Database usage, API calls

## 🎉 You're Done!

Your Android app is now:
- ✅ Built and ready to test
- ✅ Integrated with AdMob for revenue
- ✅ Using authentication for user features
- ✅ Filtering and sorting tools
- ✅ Ready for Google Play submission

---

Need help? Check:
- [Capacitor Docs](https://capacitorjs.com/docs)
- [AdMob Setup Guide](https://developers.google.com/admob/android/quick-start)
- [Google Play Console Guide](https://support.google.com/googleplay/android-developer)
