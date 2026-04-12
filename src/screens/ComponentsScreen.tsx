import { MenuItem } from '../types/menu';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../navigation/types';
import ScreenLayout from '../components/molecules/ScreenLayout';

type Props = NativeStackScreenProps<RootStackParamList, 'Components'>;

const ITEMS: MenuItem[] = [
  {
    title: 'Buttons',
    description: 'Primary, outline, loading, icon variants',
    screen: 'ComponentButtons',
    implemented: true,
    icon: 'gesture-tap-button',
  },
  {
    title: 'Inputs',
    description: 'Text fields, password, multiline',
    screen: 'ComponentInputs',
    implemented: true,
    icon: 'form-textbox',
  },
  {
    title: 'Selection Controls',
    description: 'Switch, checkbox, radio',
    screen: 'ComponentSelection',
    implemented: true,
    icon: 'checkbox-marked-outline',
  },
  {
    title: 'Typography',
    description: 'Font sizes, weights, line heights',
    screen: 'ComponentTypography',
    implemented: true,
    icon: 'format-text',
  },
  {
    title: 'Cards',
    description: 'Basic, image, action cards',
    screen: 'ComponentCards',
    implemented: false,
    icon: 'card-outline',
  },
  {
    title: 'Badges & Tags',
    description: 'Status indicators, labels',
    screen: 'ComponentBadges',
    implemented: true,
    icon: 'tag-outline',
  },
  {
    title: 'Modals & Alerts',
    description: 'Custom modal, bottom sheet, confirmation dialog',
    screen: 'ComponentModals',
    implemented: false,
    icon: 'alert-box-outline',
  },
  {
    title: 'Toast / Snackbar',
    description: 'Success, error, info notifications',
    screen: 'ComponentToast',
    implemented: false,
    icon: 'message-outline',
  },
  {
    title: 'Loading States',
    description: 'Skeleton screens, spinners, progress bars',
    screen: 'ComponentLoading',
    implemented: true,
    icon: 'loading',
  },
  {
    title: 'Lists',
    description: 'FlatList, SectionList, pull-to-refresh, infinite scroll',
    screen: 'ComponentLists',
    implemented: false,
    icon: 'format-list-bulleted',
  },
  {
    title: 'Images',
    description: 'Image, ImageBackground, lazy loading, placeholder',
    screen: 'ComponentImages',
    implemented: false,
    icon: 'image-outline',
  },
  {
    title: 'Icons',
    description: 'Vector icons showcase and usage patterns',
    screen: 'ComponentIcons',
    implemented: false,
    icon: 'emoticon-outline',
  },
  {
    title: 'Avatar',
    description: 'Image avatar, initials fallback, sizes',
    screen: 'ComponentAvatar',
    implemented: false,
    icon: 'account-circle-outline',
  },
  {
    title: 'Empty State',
    description: 'No data placeholder patterns',
    screen: 'ComponentEmptyState',
    implemented: false,
    icon: 'tray-remove',
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
