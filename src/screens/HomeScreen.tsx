import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'UI Components',
    description: 'Buttons, inputs, selection, lists, images',
    screen: 'Components',
    implemented: true,
    icon: 'palette-outline',
  },
  {
    title: 'Native Actions',
    description: 'Call, email, maps, share, camera, haptics',
    screen: 'NativeActions',
    implemented: true,
    icon: 'cellphone',
  },
  {
    title: 'Permissions',
    description: 'Camera, location, microphone, contacts',
    screen: 'Permissions',
    implemented: true,
    icon: 'shield-check-outline',
  },
  {
    title: 'Hooks & Utilities',
    description: 'Custom hooks and helpers',
    screen: 'Hooks',
    implemented: true,
    icon: 'hook',
  },
  {
    title: 'System & Device',
    description: 'Device info, network, dark mode, localization',
    screen: 'System',
    implemented: true,
    icon: 'monitor-cellphone',
  },
  {
    title: 'Forms',
    description: 'Validation, React Hook Form, date picker, search',
    screen: 'Forms',
    implemented: false,
    icon: 'form-select',
  },
  {
    title: 'Animations',
    description: 'Animated API, Reanimated, gestures, Lottie',
    screen: 'Animations',
    implemented: false,
    icon: 'animation-play-outline',
  },
  {
    title: 'Navigation Patterns',
    description: 'Tabs, drawer, modal stack, deep linking, auth flow',
    screen: 'NavigationPatterns',
    implemented: false,
    icon: 'compass-outline',
  },
  {
    title: 'Storage',
    description: 'AsyncStorage, MMKV, secure storage, SQLite',
    screen: 'Storage',
    implemented: false,
    icon: 'database-outline',
  },
  {
    title: 'Authentication',
    description: 'Firebase Auth — email, Google, Apple sign-in',
    screen: 'Auth',
    implemented: false,
    icon: 'lock-outline',
  },
  {
    title: 'Networking',
    description: 'Fetch, Axios, interceptors, offline, WebSocket',
    screen: 'Networking',
    implemented: false,
    icon: 'wifi',
  },
  {
    title: 'Testing',
    description: 'Unit, component and E2E test patterns',
    screen: 'Testing',
    implemented: false,
    icon: 'test-tube',
  },
];

const HomeScreen = ({ navigation }: Props) => (
  <ScreenLayout
    title="RNToolbox"
    items={MENU_ITEMS}
    onItemPress={item =>
      navigation.navigate(item.screen as any, item.params as any)
    }
  />
);

export default HomeScreen;
