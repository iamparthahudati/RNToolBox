import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'Hooks'>;

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'useDebounce',
    description: 'Debounced value hook',
    screen: 'ComingSoon',
    params: { title: 'useDebounce' },
    implemented: false,
  },
  {
    title: 'useLocalStorage',
    description: 'AsyncStorage wrapper hook',
    screen: 'ComingSoon',
    params: { title: 'useLocalStorage' },
    implemented: false,
  },
  {
    title: 'useNetworkStatus',
    description: 'Online and offline detection',
    screen: 'ComingSoon',
    params: { title: 'useNetworkStatus' },
    implemented: false,
  },
  {
    title: 'useAppState',
    description: 'Foreground and background detection',
    screen: 'ComingSoon',
    params: { title: 'useAppState' },
    implemented: false,
  },
  {
    title: 'useKeyboard',
    description: 'Keyboard height and visibility',
    screen: 'ComingSoon',
    params: { title: 'useKeyboard' },
    implemented: false,
  },
  {
    title: 'useTimer',
    description: 'Countdown and stopwatch',
    screen: 'ComingSoon',
    params: { title: 'useTimer' },
    implemented: false,
  },
];

const HooksScreen = ({ navigation }: Props) => (
  <ScreenLayout
    title="Hooks & Utilities"
    items={MENU_ITEMS}
    onItemPress={item =>
      navigation.navigate(item.screen as 'ComingSoon', item.params as any)
    }
  />
);

export default HooksScreen;
