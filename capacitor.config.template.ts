import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.aitoolslist.app',
  appName: 'AI Tools List',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    // For development with hot reload, uncomment the line below:
    // url: 'https://6d6ef95b-7943-4044-814c-e44ec5423c6d.lovableproject.com?forceHideBadge=true'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#2563EB',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
