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
  },
  {
    title: 'Native Actions',
    description: 'Call, email, maps, share, camera, haptics',
    screen: 'NativeActions',
    implemented: true,
  },
  {
    title: 'Permissions',
    description: 'Camera, location, microphone, contacts',
    screen: 'Permissions',
    implemented: true,
  },
  {
    title: 'Hooks & Utilities',
    description: 'Custom hooks and helpers',
    screen: 'Hooks',
    implemented: true,
  },
  {
    title: 'System & Device',
    description: 'Device info, network, dark mode, localization',
    screen: 'System',
    implemented: true,
  },
  {
    title: 'Forms',
    description: 'Validation, React Hook Form, date picker, search',
    screen: 'Forms',
    implemented: false,
  },
  {
    title: 'Animations',
    description: 'Animated API, Reanimated, gestures, Lottie',
    screen: 'Animations',
    implemented: false,
  },
  {
    title: 'Navigation Patterns',
    description: 'Tabs, drawer, modal stack, deep linking, auth flow',
    screen: 'NavigationPatterns',
    implemented: false,
  },
  {
    title: 'Storage',
    description: 'AsyncStorage, MMKV, secure storage, SQLite',
    screen: 'Storage',
    implemented: false,
  },
  {
    title: 'Authentication',
    description: 'Firebase Auth — email, Google, Apple sign-in',
    screen: 'Auth',
    implemented: false,
  },
  {
    title: 'Networking',
    description: 'Fetch, Axios, interceptors, offline, WebSocket',
    screen: 'Networking',
    implemented: false,
  },
  {
    title: 'Testing',
    description: 'Unit, component and E2E test patterns',
    screen: 'Testing',
    implemented: false,
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
