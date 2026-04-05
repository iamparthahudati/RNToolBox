declare module '@react-native-vector-icons/material-design-icons' {
  import { ComponentType } from 'react';
  import { TextStyle, ViewStyle } from 'react-native';

  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle | ViewStyle;
  }

  const MaterialDesignIcons: ComponentType<IconProps>;
  export { MaterialDesignIcons };
  export default MaterialDesignIcons;
}
