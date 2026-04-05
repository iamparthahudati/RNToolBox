import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'System'>;

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Device Info',
    description: 'Model, OS version, screen dimensions',
    screen: 'SystemDeviceInfo',
    implemented: true,
    icon: 'information-outline',
  },
  {
    title: 'Push Notifications',
    description: 'Push notification setup and handling',
    screen: 'SystemPushNotifications',
    implemented: false,
    icon: 'bell-ring-outline',
  },
  {
    title: 'Network Info',
    description: 'Connection type and IP address',
    screen: 'SystemNetwork',
    implemented: false,
    icon: 'network-outline',
  },
  {
    title: 'Environment Config',
    description: 'Dev, staging and prod config',
    screen: 'SystemEnvironment',
    implemented: false,
    icon: 'cog-outline',
  },
  {
    title: 'Dark Mode',
    description: 'useColorScheme and theme switching',
    screen: 'SystemDarkMode',
    implemented: false,
    icon: 'theme-light-dark',
  },
  {
    title: 'Localization',
    description: 'i18n, translations and RTL support',
    screen: 'SystemLocalization',
    implemented: false,
    icon: 'translate',
  },
  {
    title: 'Accessibility',
    description: 'accessibilityLabel, roles, screen reader',
    screen: 'SystemAccessibility',
    implemented: false,
    icon: 'human',
  },
  {
    title: 'Analytics',
    description: 'Firebase Analytics event logging and screen tracking',
    screen: 'SystemAnalytics',
    implemented: false,
    icon: 'chart-line',
  },
  {
    title: 'Crashlytics',
    description: 'Crash reporting and non-fatal error logging',
    screen: 'SystemCrashlytics',
    implemented: false,
    icon: 'bug-outline',
  },
];

const SystemScreen = ({ navigation }: Props) => (
  <ScreenLayout
    title="System & Device"
    items={MENU_ITEMS}
    onItemPress={item =>
      item.implemented
        ? navigation.navigate(item.screen as any)
        : navigation.navigate(item.screen as any, item.params as any)
    }
  />
);

export default SystemScreen;
