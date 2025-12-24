import React, { useRef } from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  GestureResponderEvent,
} from 'react-native';
import { styles } from './styles';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type IconPosition = 'left' | 'right';

type ButtonProps = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  debounceMs?: number;
};

const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
  icon,
  iconPosition = 'left',
  debounceMs = 0,
}: ButtonProps) => {
  const isDisabled = disabled || loading;
  const lastPressRef = useRef<number>(0);

  const handlePress = (event: GestureResponderEvent) => {
    if (!onPress) return;

    if (debounceMs > 0) {
      const now = Date.now();
      if (now - lastPressRef.current < debounceMs) return;
      lastPressRef.current = now;
    }

    onPress(event);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#2563EB' : '#FFFFFF'}
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <View style={styles.icon}>{icon}</View>
          )}

          <Text style={[styles.text, styles[`${variant}Text`]]}>
            {title}
          </Text>

          {icon && iconPosition === 'right' && (
            <View style={styles.icon}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
