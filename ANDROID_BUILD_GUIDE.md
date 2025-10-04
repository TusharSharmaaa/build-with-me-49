# Android Build Guide for Play Store

## Prerequisites
- Node.js 18+ and npm/bun installed
- Android Studio installed with Android SDK
- Java JDK 17+ installed
- Capacitor CLI: `npm install -g @capacitor/cli`

## 1. Install Dependencies
```bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android
```

## 2. Build Web Assets
```bash
npm run build
```

## 3. Initialize Capacitor (if not already done)
```bash
npx cap init
# App ID: app.lovable.6d6ef95b79434044814ce44ec5423c6d
# App Name: AI Tools List
```

## 4. Add Android Platform
```bash
npx cap add android
```

## 5. Configure AndroidManifest.xml
Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Add AdMob App ID -->
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"/>

<!-- Internet permissions -->
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
```

## 6. Add AdMob SDK to build.gradle
Edit `android/app/build.gradle`:

```gradle
dependencies {
    implementation 'com.google.android.gms:play-services-ads:22.6.0'
    implementation 'com.google.android.ump:user-messaging-platform:2.1.0'
}
```

## 7. Sync Capacitor
```bash
npx cap sync android
```

## 8. Open in Android Studio
```bash
npx cap open android
```

## 9. Configure Signing
In Android Studio:
1. Build → Generate Signed Bundle/APK
2. Create new keystore or use existing
3. Fill in keystore details
4. Choose release build variant

## 10. Build Release AAB
```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

## 11. AdMob Integration (Production)

### Replace Test IDs with Production IDs
Update `.env` or Supabase secrets:
```env
VITE_ADMOB_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY
VITE_ADMOB_BANNER_ID=ca-app-pub-XXXXXXXXXXXXXXXX/BBBBBBBBBB
VITE_ADMOB_INTERSTITIAL_ID=ca-app-pub-XXXXXXXXXXXXXXXX/IIIIIIIIII
VITE_ADMOB_REWARDED_ID=ca-app-pub-XXXXXXXXXXXXXXXX/RRRRRRRRRR
```

### Implement UMP (User Messaging Platform) for GDPR
Create `android/app/src/main/java/app/lovable/.../ConsentManager.kt`:

```kotlin
import com.google.android.ump.*

class ConsentManager(private val activity: Activity) {
    private val consentInformation: ConsentInformation = 
        UserMessagingPlatform.getConsentInformation(activity)

    fun requestConsent(onComplete: () -> Unit) {
        val params = ConsentRequestParameters.Builder()
            .setTagForUnderAgeOfConsent(false)
            .build()

        consentInformation.requestConsentInfoUpdate(
            activity,
            params,
            {
                if (consentInformation.isConsentFormAvailable) {
                    loadForm(onComplete)
                } else {
                    onComplete()
                }
            },
            { onComplete() }
        )
    }

    private fun loadForm(onComplete: () -> Unit) {
        UserMessagingPlatform.loadConsentForm(
            activity,
            { form ->
                if (consentInformation.consentStatus == ConsentInformation.ConsentStatus.REQUIRED) {
                    form.show(activity) { onComplete() }
                } else {
                    onComplete()
                }
            },
            { onComplete() }
        )
    }
}
```

Call in MainActivity:
```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    ConsentManager(this).requestConsent {
        // Initialize AdMob
        MobileAds.initialize(this)
    }
}
```

## 12. Play Store Submission Checklist
- [ ] App signed with production keystore
- [ ] AdMob production IDs configured
- [ ] Privacy Policy link in Play Console
- [ ] GDPR consent flow implemented (UMP)
- [ ] Screenshots prepared (phone + tablet)
- [ ] App icon 512x512 PNG
- [ ] Feature graphic 1024x500
- [ ] App description with keywords
- [ ] Content rating questionnaire completed
- [ ] Target API level 34 (Android 14)
- [ ] 64-bit libraries included
- [ ] ProGuard enabled for release builds

## 13. Remote Config for Ads
The app reads ad frequencies from Supabase `remote_config` table:

```sql
-- Example row
INSERT INTO remote_config (config_key, config_value) VALUES (
  'ads_config',
  '{
    "ads": {
      "interstitialEveryNDetails": 2,
      "interstitialMinSeconds": 120,
      "rewardedEveryNSearches": 10,
      "rewardedMinSeconds": 300,
      "bannersEnabled": true,
      "interstitialEnabled": true,
      "rewardedEnabled": true
    }
  }'::jsonb
);
```

Update this row to adjust ad frequencies without app updates.

## Troubleshooting

### Build errors
- Clean: `./gradlew clean`
- Invalidate cache in Android Studio
- Check Java version: `java -version`

### AdMob not showing
- Verify App ID in AndroidManifest
- Check test device IDs
- Enable logging: `MobileAds.setRequestConfiguration(...)`

### Capacitor sync issues
```bash
npx cap sync android --force
```
