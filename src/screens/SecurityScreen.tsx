import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'Security'>;

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'App Masking',
    description: 'Hide sensitive content when app enters background',
    screen: 'SecurityAppMasking',
    implemented: true,
    icon: 'eye-off-outline',
  },
  {
    title: 'Jailbreak & Root Detection',
    description: 'Detect compromised devices at runtime',
    screen: 'SecurityJailbreak',
    implemented: true,
    icon: 'shield-alert-outline',
  },
  {
    title: 'Screenshot Prevention',
    description: 'Block screenshots and screen recordings',
    screen: 'SecurityScreenshot',
    implemented: true,
    icon: 'camera-off-outline',
  },
  {
    title: 'Certificate Pinning',
    description: 'Prevent MITM attacks by pinning TLS certificates',
    screen: 'SecurityCertPinning',
    implemented: true,
    icon: 'certificate-outline',
  },
  {
    title: 'Obfuscation & Debug Detection',
    description: 'Detect debuggers, emulators and reverse engineering attempts',
    screen: 'SecurityObfuscation',
    implemented: true,
    icon: 'bug-check-outline',
  },
];

const SecurityScreen = ({ navigation }: Props) => (
  <ScreenLayout
    title="Security"
    items={MENU_ITEMS}
    onItemPress={item => navigation.navigate(item.screen as any)}
  />
);

export default SecurityScreen;
