import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'UI Components',
    description: 'Buttons, Inputs, Selection controls',
    screen: 'Components',
    implemented: true,
  },
  {
    title: 'Native Actions',
    description: 'Call, Email, Maps, Share',
    screen: 'NativeActions',
    implemented: true,
  },
  {
    title: 'Permissions',
    description: 'Camera, Location, Storage',
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
    description: 'App state, network, settings',
    screen: 'System',
    implemented: true,
  },
  {
    title: 'Animations',
    description: 'FadeIn, SlideIn, spring, Reanimated basics',
    screen: 'ComingSoon',
    params: { title: 'Animations' },
    implemented: false,
  },
  {
    title: 'Forms',
    description: 'Validation, error states, form submission',
    screen: 'ComingSoon',
    params: { title: 'Forms' },
    implemented: false,
  },
  {
    title: 'Navigation Patterns',
    description: 'Tabs, drawer, modal stack demo',
    screen: 'ComingSoon',
    params: { title: 'Navigation Patterns' },
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
