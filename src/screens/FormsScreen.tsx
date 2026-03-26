import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ScreenLayout from '../components/molecules/ScreenLayout';
import { RootStackParamList } from '../navigation/types';
import { MenuItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'Forms'>;

const ITEMS: MenuItem[] = [
  {
    title: 'Form Validation',
    description: 'Required fields, regex, real-time vs on-submit',
    screen: 'FormsValidation',
    implemented: false,
  },
  {
    title: 'React Hook Form',
    description: 'The standard RN form library',
    screen: 'FormsHookForm',
    implemented: false,
  },
  {
    title: 'Date Picker',
    description: 'Native date and time picker',
    screen: 'FormsDatePicker',
    implemented: false,
  },
  {
    title: 'Dropdown / Select',
    description: 'Picker and custom dropdown component',
    screen: 'FormsDropdown',
    implemented: false,
  },
  {
    title: 'Search Input',
    description: 'Debounced search with clear button',
    screen: 'FormsSearch',
    implemented: false,
  },
];

const FormsScreen = ({ navigation }: Props) => (
  <ScreenLayout
    title="Forms"
    items={ITEMS}
    onItemPress={item =>
      navigation.navigate(item.screen as any, item.params as any)
    }
  />
);

export default FormsScreen;
