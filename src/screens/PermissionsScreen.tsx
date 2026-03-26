import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'Permissions'>;

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Camera',
    description: 'Camera access permission',
    screen: 'ComingSoon',
    params: { title: 'Camera Permission' },
    implemented: false,
  },
  {
    title: 'Location',
    description: 'GPS and location access',
    screen: 'ComingSoon',
    params: { title: 'Location Permission' },
    implemented: false,
  },
  {
    title: 'Notifications',
    description: 'Push notification permission',
    screen: 'ComingSoon',
    params: { title: 'Notifications Permission' },
    implemented: false,
  },
  {
    title: 'Microphone',
    description: 'Audio recording access',
    screen: 'ComingSoon',
    params: { title: 'Microphone Permission' },
    implemented: false,
  },
  {
    title: 'Contacts',
    description: 'Address book access',
    screen: 'ComingSoon',
    params: { title: 'Contacts Permission' },
    implemented: false,
  },
  {
    title: 'Photo Library',
    description: 'Photos and media access',
    screen: 'ComingSoon',
    params: { title: 'Photo Library Permission' },
    implemented: false,
  },
  {
    title: 'Bluetooth',
    description: 'Bluetooth device access',
    screen: 'ComingSoon',
    params: { title: 'Bluetooth Permission' },
    implemented: false,
  },
];

const PermissionsScreen = ({ navigation }: Props) => (
  <ScreenLayout
    title="Permissions"
    items={MENU_ITEMS}
    onItemPress={item =>
      navigation.navigate(item.screen as 'ComingSoon', item.params as any)
    }
  />
);

export default PermissionsScreen;
