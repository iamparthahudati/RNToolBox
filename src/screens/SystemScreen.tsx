import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'System'>;

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Push Notifications',
    description: 'Push notification setup',
    screen: 'ComingSoon',
    params: { title: 'Push Notifications' },
    implemented: false,
  },
  {
    title: 'Device Info',
    description: 'Model, OS version, screen dimensions',
    screen: 'SystemDeviceInfo',
    implemented: true,
  },
  {
    title: 'Network Info',
    description: 'Connection type and IP address',
    screen: 'ComingSoon',
    params: { title: 'Network Info' },
    implemented: false,
  },
  {
    title: 'AsyncStorage',
    description: 'Read, write and delete demo',
    screen: 'ComingSoon',
    params: { title: 'AsyncStorage' },
    implemented: false,
  },
  {
    title: 'Secure Store',
    description: 'Encrypted key-value storage',
    screen: 'ComingSoon',
    params: { title: 'Secure Store' },
    implemented: false,
  },
  {
    title: 'Environment',
    description: 'Dev, staging and prod config',
    screen: 'ComingSoon',
    params: { title: 'Environment' },
    implemented: false,
  },
];

const SystemScreen = ({ navigation }: Props) => (
  <ScreenLayout
    title="System & Device"
    items={MENU_ITEMS}
    onItemPress={item =>
      item.implemented
        ? navigation.navigate(item.screen as any)
        : navigation.navigate('ComingSoon', item.params as any)
    }
  />
);

export default SystemScreen;
