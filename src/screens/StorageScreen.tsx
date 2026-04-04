import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'Storage'>;

const ITEMS: MenuItem[] = [
  {
    title: 'AsyncStorage',
    description: 'Read, write and delete key-value pairs',
    screen: 'StorageAsyncStorage',
    implemented: false,
  },
  {
    title: 'MMKV',
    description: 'Fast synchronous key-value storage',
    screen: 'StorageMMKV',
    implemented: false,
  },
  {
    title: 'Secure Storage',
    description: 'Encrypted storage for sensitive data',
    screen: 'StorageSecure',
    implemented: false,
  },
  {
    title: 'SQLite',
    description: 'Structured local relational data',
    screen: 'StorageSQLite',
    implemented: false,
  },
  {
    title: 'Firebase Storage',
    description: 'Upload, download and manage files in Firebase Storage',
    screen: 'StorageFirebase',
    implemented: false,
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
