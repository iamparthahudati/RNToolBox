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
    screen: 'ComingSoon',
    params: { title: 'Typography' },
    implemented: false,
  },
  {
    title: 'Cards',
    description: 'Basic, image, action cards',
    screen: 'ComingSoon',
    params: { title: 'Cards' },
    implemented: false,
  },
  {
    title: 'Badges & Tags',
    description: 'Status indicators, labels',
    screen: 'ComingSoon',
    params: { title: 'Badges & Tags' },
    implemented: false,
  },
  {
    title: 'Modals & Alerts',
    description: 'Custom modal, bottom sheet, confirmation dialog',
    screen: 'ComingSoon',
    params: { title: 'Modals & Alerts' },
    implemented: false,
  },
  {
    title: 'Toast / Snackbar',
    description: 'Success, error, info notifications',
    screen: 'ComingSoon',
    params: { title: 'Toast / Snackbar' },
    implemented: false,
  },
  {
    title: 'Loading States',
    description: 'Skeleton screens, spinners, progress bars',
    screen: 'ComingSoon',
    params: { title: 'Loading States' },
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
