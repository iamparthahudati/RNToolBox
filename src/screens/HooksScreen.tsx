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
    screen: 'HooksDebounce',
    implemented: false,
  },
  {
    title: 'useLocalStorage',
    description: 'AsyncStorage wrapper hook',
    screen: 'HooksLocalStorage',
    implemented: false,
  },
  {
    title: 'useNetworkStatus',
    description: 'Online and offline detection',
    screen: 'HooksNetworkStatus',
    implemented: false,
  },
  {
    title: 'useAppState',
    description: 'Foreground and background detection',
    screen: 'HooksAppState',
    implemented: false,
  },
  {
    title: 'useKeyboard',
    description: 'Keyboard height and visibility',
    screen: 'HooksKeyboard',
    implemented: false,
  },
  {
    title: 'useTimer',
    description: 'Countdown and stopwatch',
    screen: 'HooksTimer',
    implemented: false,
  },
];

const HooksScreen = ({ navigation }: Props) => (
  <ScreenLayout
    title="Hooks & Utilities"
    items={MENU_ITEMS}
    onItemPress={item =>
      navigation.navigate(item.screen as any, item.params as any)
    }
  />
);

export default HooksScreen;
