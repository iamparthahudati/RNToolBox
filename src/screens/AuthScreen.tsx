import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

const ITEMS: MenuItem[] = [
  {
    title: 'Email Auth',
    description: 'Email and password authentication',
    screen: 'AuthEmail',
    implemented: true,
  },
  {
    title: 'Google Sign In',
    description: 'Sign in with Google account',
    screen: 'AuthGoogle',
    implemented: true,
  },
  {
    title: 'Apple Sign In',
    description: 'Sign in with Apple ID',
    screen: 'AuthApple',
    implemented: true,
  },
  {
    title: 'Phone OTP',
    description: 'SMS OTP verification via Firebase Auth',
    screen: 'AuthPhoneOTP',
    implemented: true,
  },
  {
    title: 'Anonymous',
    description: 'Anonymous sign-in session',
    screen: 'AuthAnonymous',
    implemented: true,
  },
];

export default function AuthScreen({ navigation }: Props) {
  return (
    <ScreenLayout
      title="Auth"
      items={ITEMS}
      onItemPress={item =>
        navigation.navigate(item.screen as any, item.params as any)
      }
    />
  );
}
