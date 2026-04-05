import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'NavigationPatterns'>;

const ITEMS: MenuItem[] = [
  {
    title: 'Tab Navigator',
    description: 'Bottom tab navigation pattern',
    screen: 'NavigationTabs',
    implemented: false,
    icon: 'tab',
  },
  {
    title: 'Drawer Navigator',
    description: 'Side menu drawer pattern',
    screen: 'NavigationDrawer',
    implemented: false,
    icon: 'menu',
  },
  {
    title: 'Modal Stack',
    description: 'Presenting screens as modals',
    screen: 'NavigationModal',
    implemented: false,
    icon: 'layers-outline',
  },
  {
    title: 'Deep Linking',
    description: 'URL scheme and universal link handling',
    screen: 'NavigationDeepLink',
    implemented: false,
    icon: 'link-variant',
  },
  {
    title: 'Auth Flow',
    description: 'Conditional stack for logged in vs logged out',
    screen: 'NavigationAuthFlow',
    implemented: false,
    icon: 'account-arrow-right-outline',
  },
];

const NavigationPatternsScreen = ({ navigation }: Props) => (
  <ScreenLayout
    title="Navigation Patterns"
    items={ITEMS}
    onItemPress={item =>
      navigation.navigate(item.screen as any, item.params as any)
    }
  />
);

export default NavigationPatternsScreen;
