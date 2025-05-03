import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ticktok.app',
  appName: 'ticktok',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    Camera: {
      cameraPermission: '需要访问相机权限',
      photosPermission: '需要访问相册权限'
    },
    Filesystem: {
      androidPermissions: ['READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE']
    }
  }
};

export default config;
