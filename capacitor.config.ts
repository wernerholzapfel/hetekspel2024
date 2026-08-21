import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wernerholzapfel.hetekspel',
  appName: 'Het WK Spel',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    CapacitorUpdater: {
      autoUpdate: true,
      directUpdate: 'always', // or 'atInstall' for updates only on app install/update
      autoSplashscreen: true,
    }
  },
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      'android-minSdkVersion': '22',
      'android-targetSdkVersion': '29',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000'
    }
  },
  ios: {
    includePlugins: ["@capgo/capacitor-updater", '@capacitor/app', '@capacitor/haptics', '@capacitor/keyboard'
      , '@capacitor/push-notifications', '@capacitor/splash-screen', '@capacitor/status-bar', '@awesome-cordova-plugins/core'],
  }
};

export default config;