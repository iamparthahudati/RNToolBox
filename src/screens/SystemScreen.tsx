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
  },
  {
    title: 'Push Notifications',
    description: 'Push notification setup and handling',
    screen: 'SystemPushNotifications',
    implemented: false,
  },
  {
    title: 'Network Info',
    description: 'Connection type and IP address',
    screen: 'SystemNetwork',
    implemented: false,
  },
  {
    title: 'Environment Config',
    description: 'Dev, staging and prod config',
    screen: 'SystemEnvironment',
    implemented: false,
  },
  {
    title: 'Dark Mode',
    description: 'useColorScheme and theme switching',
    screen: 'SystemDarkMode',
    implemented: false,
  },
  {
    title: 'Localization',
    description: 'i18n, translations and RTL support',
    screen: 'SystemLocalization',
    implemented: false,
  },
  {
    title: 'Accessibility',
    description: 'accessibilityLabel, roles, screen reader',
    screen: 'SystemAccessibility',
    implemented: false,
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
