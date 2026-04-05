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
    icon: 'camera-outline',
  },
  {
    title: 'Location',
    description: 'GPS and location access',
    screen: 'PermissionsLocation',
    implemented: false,
    icon: 'map-marker-outline',
  },
  {
    title: 'Notifications',
    description: 'Push notification permission',
    screen: 'PermissionsNotifications',
    implemented: false,
    icon: 'bell-outline',
  },
  {
    title: 'Microphone',
    description: 'Audio recording access',
    screen: 'PermissionsMicrophone',
    implemented: false,
    icon: 'microphone-outline',
  },
  {
    title: 'Contacts',
    description: 'Address book access',
    screen: 'PermissionsContacts',
    implemented: false,
    icon: 'contacts-outline',
  },
  {
    title: 'Photo Library',
    description: 'Photos and media access',
    screen: 'PermissionsPhotoLibrary',
    implemented: false,
    icon: 'image-multiple-outline',
  },
  {
    title: 'Bluetooth',
    description: 'Bluetooth device access',
    screen: 'PermissionsBluetooth',
    implemented: false,
    icon: 'bluetooth',
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
