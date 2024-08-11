import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'reserva.system.frontend',
  appName: 'reserva-system-frontend',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    hostname: '0.0.0.0'
  }
};

export default config;
