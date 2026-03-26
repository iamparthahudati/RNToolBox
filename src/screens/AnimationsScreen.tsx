import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'Animations'>;

const ITEMS: MenuItem[] = [
  {
    title: 'Animated API',
    description: 'Fade, slide, scale basics with Animated',
    screen: 'AnimationsBasic',
    implemented: false,
  },
  {
    title: 'LayoutAnimation',
    description: 'Auto-animate layout changes',
    screen: 'AnimationsLayout',
    implemented: false,
  },
  {
    title: 'Reanimated',
    description: 'useSharedValue, useAnimatedStyle',
    screen: 'AnimationsReanimated',
    implemented: false,
  },
  {
    title: 'Gesture Handler',
    description: 'Swipe, pan, pinch gestures',
    screen: 'AnimationsGesture',
    implemented: false,
  },
  {
    title: 'Lottie',
    description: 'JSON animation playback',
    screen: 'AnimationsLottie',
    implemented: false,
  },
];

const AnimationsScreen = ({ navigation }: Props) => (
  <ScreenLayout
    title="Animations"
    items={ITEMS}
    onItemPress={item =>
      navigation.navigate(item.screen as any, item.params as any)
    }
  />
);

export default AnimationsScreen;
