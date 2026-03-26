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
    screen: 'PermissionsCamera',
    implemented: false,
  },
  {
    title: 'Location',
    description: 'GPS and location access',
    screen: 'PermissionsLocation',
    implemented: false,
  },
  {
    title: 'Notifications',
    description: 'Push notification permission',
    screen: 'PermissionsNotifications',
    implemented: false,
  },
  {
    title: 'Microphone',
    description: 'Audio recording access',
    screen: 'PermissionsMicrophone',
    implemented: false,
  },
  {
    title: 'Contacts',
    description: 'Address book access',
    screen: 'PermissionsContacts',
    implemented: false,
  },
  {
    title: 'Photo Library',
    description: 'Photos and media access',
    screen: 'PermissionsPhotoLibrary',
    implemented: false,
  },
  {
    title: 'Bluetooth',
    description: 'Bluetooth device access',
    screen: 'PermissionsBluetooth',
    implemented: false,
  },
];

const PermissionsScreen = ({ navigation }: Props) => (
  <ScreenLayout
    title="Permissions"
    items={MENU_ITEMS}
    onItemPress={item =>
      navigation.navigate(item.screen as any, item.params as any)
    }
  />
);

export default PermissionsScreen;
