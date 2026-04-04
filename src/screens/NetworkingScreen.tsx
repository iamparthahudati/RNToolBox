import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'Networking'>;

const ITEMS: MenuItem[] = [
  {
    title: 'Fetch API',
    description: 'GET, POST, headers and error handling',
    screen: 'NetworkingFetch',
    implemented: false,
  },
  {
    title: 'Axios',
    description: 'Axios instance, requests and responses',
    screen: 'NetworkingAxios',
    implemented: false,
  },
  {
    title: 'Interceptors',
    description: 'Auth token injection and response handling',
    screen: 'NetworkingInterceptors',
    implemented: false,
  },
  {
    title: 'Offline Detection',
    description: 'NetInfo and retry logic',
    screen: 'NetworkingOffline',
    implemented: false,
  },
  {
    title: 'WebSocket',
    description: 'Real-time connection demo',
    screen: 'NetworkingWebSocket',
    implemented: false,
  },
  {
    title: 'Firestore',
    description: 'Cloud Firestore read, write, query and real-time updates',
    screen: 'NetworkingFirestore',
    implemented: false,
  },
  {
    title: 'Realtime Database',
    description: 'Firebase Realtime Database read, write and listeners',
    screen: 'NetworkingRealtimeDB',
    implemented: false,
  },
  {
    title: 'Remote Config',
    description: 'Fetch and activate Firebase Remote Config values',
    screen: 'NetworkingRemoteConfig',
    implemented: true,
  },
];

const NetworkingScreen = ({ navigation }: Props) => (
  <ScreenLayout
    title="Networking"
    items={ITEMS}
    onItemPress={item =>
      navigation.navigate(item.screen as any, item.params as any)
    }
  />
);

export default NetworkingScreen;
