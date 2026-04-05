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
    icon: 'check-circle-outline',
  },
  {
    title: 'React Hook Form',
    description: 'The standard RN form library',
    screen: 'FormsHookForm',
    implemented: false,
    icon: 'hook',
  },
  {
    title: 'Date Picker',
    description: 'Native date and time picker',
    screen: 'FormsDatePicker',
    implemented: false,
    icon: 'calendar-outline',
  },
  {
    title: 'Dropdown / Select',
    description: 'Picker and custom dropdown component',
    screen: 'FormsDropdown',
    implemented: false,
    icon: 'chevron-down-circle-outline',
  },
  {
    title: 'Search Input',
    description: 'Debounced search with clear button',
    screen: 'FormsSearch',
    implemented: false,
    icon: 'magnify',
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
