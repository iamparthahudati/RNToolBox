import { RootStackParamList } from '../navigation/types';

export type MenuItem = {
  title: string;
  description: string;
  screen: keyof RootStackParamList;
  params?: Record<string, any>;
  implemented: boolean;
};
