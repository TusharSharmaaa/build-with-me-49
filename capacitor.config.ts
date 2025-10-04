import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6d6ef95b79434044814ce44ec5423c6d',
  appName: 'AI Tools List',
  webDir: 'dist',
  server: {
    url: 'https://6d6ef95b-7943-4044-814c-e44ec5423c6d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
