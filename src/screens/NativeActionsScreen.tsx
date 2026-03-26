import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeActions'>;

const ITEMS: MenuItem[] = [
  {
    title: 'Call Phone',
    description: 'Dial a number via native dialer',
    screen: 'NativeCallPhone',
    implemented: true,
  },
  {
    title: 'Send Email',
    description: 'Open native email composer',
    screen: 'NativeSendEmail',
    implemented: true,
  },
  {
    title: 'Open Maps',
    description: 'Navigate to an address',
    screen: 'NativeMaps',
    implemented: true,
  },
  {
    title: 'OTP / Clipboard',
    description: 'Copy and paste from clipboard',
    screen: 'NativeClipboard',
    implemented: true,
  },
  {
    title: 'Share',
    description: 'Native share sheet',
    screen: 'NativeShare',
    implemented: true,
  },
  {
    title: 'Image Picker',
    description: 'Camera and gallery picker',
    screen: 'ComingSoon',
    params: { title: 'Image Picker' },
    implemented: false,
  },
  {
    title: 'File Picker',
    description: 'Document selection',
    screen: 'ComingSoon',
    params: { title: 'File Picker' },
    implemented: false,
  },
  {
    title: 'Haptics',
    description: 'Vibration feedback patterns',
    screen: 'ComingSoon',
    params: { title: 'Haptics' },
    implemented: false,
  },
  {
    title: 'Biometrics',
    description: 'Face ID and fingerprint auth',
    screen: 'ComingSoon',
    params: { title: 'Biometrics' },
    implemented: false,
  },
];

export default function NativeActionsScreen({ navigation }: Props) {
  return (
    <ScreenLayout
      title="Native Actions"
      items={ITEMS}
      onItemPress={item =>
        navigation.navigate(item.screen as any, item.params as any)
      }
    />
  );
}
