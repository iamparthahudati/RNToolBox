import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'Components'>;

const ITEMS: MenuItem[] = [
  {
    title: 'Buttons',
    description: 'Primary, outline, loading, icon variants',
    screen: 'ComponentButtons',
    implemented: true,
  },
  {
    title: 'Inputs',
    description: 'Text fields, password, multiline',
    screen: 'ComponentInputs',
    implemented: true,
  },
  {
    title: 'Selection Controls',
    description: 'Switch, checkbox, radio',
    screen: 'ComponentSelection',
    implemented: true,
  },
  {
    title: 'Typography',
    description: 'Font sizes, weights, line heights',
    screen: 'ComponentTypography',
    implemented: false,
  },
  {
    title: 'Cards',
    description: 'Basic, image, action cards',
    screen: 'ComponentCards',
    implemented: false,
  },
  {
    title: 'Badges & Tags',
    description: 'Status indicators, labels',
    screen: 'ComponentBadges',
    implemented: false,
  },
  {
    title: 'Modals & Alerts',
    description: 'Custom modal, bottom sheet, confirmation dialog',
    screen: 'ComponentModals',
    implemented: false,
  },
  {
    title: 'Toast / Snackbar',
    description: 'Success, error, info notifications',
    screen: 'ComponentToast',
    implemented: false,
  },
  {
    title: 'Loading States',
    description: 'Skeleton screens, spinners, progress bars',
    screen: 'ComponentLoading',
    implemented: false,
  },
  {
    title: 'Lists',
    description: 'FlatList, SectionList, pull-to-refresh, infinite scroll',
    screen: 'ComponentLists',
    implemented: false,
  },
  {
    title: 'Images',
    description: 'Image, ImageBackground, lazy loading, placeholder',
    screen: 'ComponentImages',
    implemented: false,
  },
  {
    title: 'Icons',
    description: 'Vector icons showcase and usage patterns',
    screen: 'ComponentIcons',
    implemented: false,
  },
  {
    title: 'Avatar',
    description: 'Image avatar, initials fallback, sizes',
    screen: 'ComponentAvatar',
    implemented: false,
  },
  {
    title: 'Empty State',
    description: 'No data placeholder patterns',
    screen: 'ComponentEmptyState',
    implemented: false,
  },
];

export default function ComponentsScreen({ navigation }: Props) {
  return (
    <ScreenLayout
      title="Components"
      items={ITEMS}
      onItemPress={item =>
        navigation.navigate(item.screen as any, item.params as any)
      }
    />
  );
}
