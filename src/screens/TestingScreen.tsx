import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'Testing'>;

const ITEMS: MenuItem[] = [
  {
    title: 'Unit Tests',
    description: 'Jest tests for services and hooks',
    screen: 'TestingUnit',
    implemented: false,
    icon: 'test-tube',
  },
  {
    title: 'Component Tests',
    description: 'React Native Testing Library patterns',
    screen: 'TestingComponent',
    implemented: false,
    icon: 'puzzle-outline',
  },
  {
    title: 'E2E Tests',
    description: 'Detox setup and example flows',
    screen: 'TestingE2E',
    implemented: false,
    icon: 'robot-outline',
  },
];

const TestingScreen = ({ navigation }: Props) => (
  <ScreenLayout
    title="Testing"
    items={ITEMS}
    onItemPress={item =>
      navigation.navigate(item.screen as any, item.params as any)
    }
  />
);

export default TestingScreen;
