import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'Refactoring'>;

const ITEMS: MenuItem[] = [
  {
    title: 'Folder Structure',
    description: 'Scalable directory layout, barrel exports, module boundaries',
    screen: 'RefactoringFolderStructure',
    implemented: false,
    icon: 'folder-outline',
  },
  {
    title: 'Atomic Design',
    description:
      'Atoms, molecules, organisms — splitting and composing components',
    screen: 'RefactoringAtomicDesign',
    implemented: false,
    icon: 'atom',
  },
  {
    title: 'Custom Hooks',
    description: 'Extract logic from components into reusable, testable hooks',
    screen: 'RefactoringCustomHooks',
    implemented: false,
    icon: 'hook',
  },
  {
    title: 'Service Layer',
    description: 'Isolate API calls, native bridges and side effects from UI',
    screen: 'RefactoringServiceLayer',
    implemented: false,
    icon: 'layers-outline',
  },
  {
    title: 'State Management',
    description: 'Context vs Zustand vs Redux — when and how to refactor',
    screen: 'RefactoringStateManagement',
    implemented: false,
    icon: 'database-cog-outline',
  },
  {
    title: 'Type Safety',
    description: 'Strict TypeScript, discriminated unions, eliminating any',
    screen: 'RefactoringTypeSafety',
    implemented: false,
    icon: 'shield-check-outline',
  },
  {
    title: 'Performance',
    description:
      'memo, useCallback, useMemo, FlatList optimizations, profiling',
    screen: 'RefactoringPerformance',
    implemented: false,
    icon: 'speedometer-outline',
  },
  {
    title: 'Error Boundaries',
    description: 'Graceful error handling, fallback UI, crash reporting hooks',
    screen: 'RefactoringErrorBoundaries',
    implemented: false,
    icon: 'alert-circle-outline',
  },
  {
    title: 'Code Splitting',
    description: 'Lazy screens, dynamic imports and bundle size reduction',
    screen: 'RefactoringCodeSplitting',
    implemented: false,
    icon: 'scissors-cutting',
  },
];

const RefactoringScreen = ({ navigation }: Props) => (
  <ScreenLayout
    title="Code Refactoring"
    items={ITEMS}
    onItemPress={item =>
      navigation.navigate(item.screen as any, item.params as any)
    }
  />
);

export default RefactoringScreen;
