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
    icon: 'phone-outline',
  },
  {
    title: 'Send Email',
    description: 'Open native email composer',
    screen: 'NativeSendEmail',
    implemented: true,
    icon: 'email-outline',
  },
  {
    title: 'Open Maps',
    description: 'Navigate to an address',
    screen: 'NativeMaps',
    implemented: true,
    icon: 'map-outline',
  },
  {
    title: 'OTP / Clipboard',
    description: 'Copy and paste from clipboard',
    screen: 'NativeClipboard',
    implemented: true,
    icon: 'clipboard-outline',
  },
  {
    title: 'Share',
    description: 'Native share sheet',
    screen: 'NativeShare',
    implemented: true,
    icon: 'share-variant-outline',
  },
  {
    title: 'Image Picker',
    description: 'Camera and gallery picker',
    screen: 'NativeImagePicker',
    implemented: false,
    icon: 'image-plus',
  },
  {
    title: 'File Picker',
    description: 'Document selection',
    screen: 'NativeFilePicker',
    implemented: false,
    icon: 'file-outline',
  },
  {
    title: 'Haptics',
    description: 'Vibration feedback patterns',
    screen: 'NativeHaptics',
    implemented: true,
    icon: 'vibrate',
  },
  {
    title: 'Biometrics',
    description: 'Face ID and fingerprint auth',
    screen: 'NativeBiometrics',
    implemented: true,
    icon: 'fingerprint',
  },
  {
    title: 'Camera',
    description: 'Live camera preview and capture',
    screen: 'NativeCamera',
    implemented: false,
    icon: 'camera-outline',
  },
  {
    title: 'Barcode / QR Scanner',
    description: 'Scan barcodes and QR codes',
    screen: 'NativeBarcode',
    implemented: false,
    icon: 'qrcode-scan',
  },
  {
    title: 'FCM Push Notifications',
    description: 'Firebase Cloud Messaging token and notifications',
    screen: 'NativeFCMPushNotifications',
    implemented: false,
    icon: 'bell-outline',
  },
  {
    title: 'Background Tasks',
    description: 'Run tasks when app is in background',
    screen: 'NativeBackgroundTasks',
    implemented: false,
    icon: 'timer-sand',
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
