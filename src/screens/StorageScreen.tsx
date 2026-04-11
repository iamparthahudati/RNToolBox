import { MenuItem } from '../types/menu';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../navigation/types';
import ScreenLayout from '../components/molecules/ScreenLayout';

type Props = NativeStackScreenProps<RootStackParamList, 'Storage'>;

const ITEMS: MenuItem[] = [
  {
    title: 'AsyncStorage',
    description: 'Read, write and delete key-value pairs',
    screen: 'StorageAsyncStorage',
    implemented: true,
    icon: 'archive-outline',
  },
  {
    title: 'MMKV',
    description: 'Fast synchronous key-value storage',
    screen: 'StorageMMKV',
    implemented: false,
    icon: 'flash-outline',
  },
  {
    title: 'Secure Storage',
    description: 'Encrypted storage for sensitive data',
    screen: 'StorageSecure',
    implemented: false,
    icon: 'lock-outline',
  },
  {
    title: 'SQLite',
    description: 'Structured local relational data',
    screen: 'StorageSQLite',
    implemented: false,
    icon: 'table',
  },
  {
    title: 'Firebase Storage',
    description: 'Upload, download and manage files in Firebase Storage',
    screen: 'StorageFirebase',
    implemented: false,
    icon: 'firebase',
  },
];

const StorageScreen = ({ navigation }: Props) => (
  <ScreenLayout
    title="Storage"
    items={ITEMS}
    onItemPress={item =>
      navigation.navigate(item.screen as any, item.params as any)
    }
  />
);

export default StorageScreen;
