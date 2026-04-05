import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  GestureResponderEvent,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTheme } from '../../../theme';
import { staticStyles } from './styles';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
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
  const { colors, typography, glow } = useTheme();
  const isDisabled = disabled || loading;
  const lastPressRef = useRef<number>(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isPressed = useRef(false);

  const handlePressIn = () => {
    isPressed.current = true;
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    isPressed.current = false;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (!onPress) return;
    if (debounceMs > 0) {
      const now = Date.now();
      if (now - lastPressRef.current < debounceMs) return;
      lastPressRef.current = now;
    }
    onPress(event);
  };

  // Variant-specific background, text color, border, and shadow
  const variantStyles = (() => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary600,
          textColor: colors.white,
          borderWidth: 0,
          borderColor: undefined,
          shadow: glow.primary,
        };
      case 'secondary':
        return {
          backgroundColor: colors.surface,
          textColor: colors.primary600,
          borderWidth: 0,
          borderColor: undefined,
          shadow: undefined,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          textColor: colors.primary600,
          borderWidth: 1.5,
          borderColor: colors.primary600,
          shadow: undefined,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          textColor: colors.primary600,
          borderWidth: 0,
          borderColor: undefined,
          shadow: undefined,
        };
    }
  })();

  const containerStyle = [
    staticStyles.base,
    {
      backgroundColor: variantStyles.backgroundColor,
      borderWidth: variantStyles.borderWidth,
      borderColor: variantStyles.borderColor,
      ...(variantStyles.shadow ?? {}),
    },
    fullWidth && staticStyles.fullWidth,
    isDisabled && staticStyles.disabled,
  ];

  return (
    <TouchableWithoutFeedback
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
    >
      <Animated.View
        style={[containerStyle, { transform: [{ scale: scaleAnim }] }]}
      >
        {loading ? (
          <ActivityIndicator color={variantStyles.textColor} />
        ) : (
          <View style={staticStyles.content}>
            {icon && iconPosition === 'left' && (
              <View style={staticStyles.icon}>{icon}</View>
            )}
            <Text
              style={[
                typography.presets.label,
                {
                  color: variantStyles.textColor,
                  fontWeight: '600',
                  letterSpacing: typography.letterSpacing.wider,
                },
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <View style={staticStyles.icon}>{icon}</View>
            )}
          </View>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Button;
