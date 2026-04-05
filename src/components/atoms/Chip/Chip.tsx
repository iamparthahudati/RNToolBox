import Icon from '@react-native-vector-icons/MaterialDesignIcons';
import React, { useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useTheme } from '../../../theme';

type ChipProps = {
  label: string;
  sublabel?: string;
  active?: boolean;
  onPress: () => void;
  icon?: string;
  size?: 'sm' | 'md';
};

const Chip = ({
  label,
  sublabel,
  active = false,
  onPress,
  icon,
  size = 'md',
}: ChipProps) => {
  const { colors, typography } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const isSm = size === 'sm';
  const paddingVertical = isSm ? 4 : 8;
  const paddingHorizontal = isSm ? 10 : 14;
  const fontSize = isSm ? 12 : 13;
  const iconSize = isSm ? 12 : 14;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const containerStyle = {
    paddingVertical,
    paddingHorizontal,
    borderRadius: 20,
    borderWidth: active ? 0 : 1,
    borderColor: colors.border,
    backgroundColor: active ? colors.primary600 : colors.surface,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    alignSelf: 'flex-start' as const,
  };

  const labelColor = active ? colors.white : colors.textSecondary;

  const labelStyle = {
    fontSize,
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.weights.medium as '500',
    color: labelColor,
    lineHeight: Math.round(fontSize * 1.4),
  };

  const sublabelStyle = {
    fontSize: fontSize - 1,
    fontFamily: typography.fontFamily.sans,
    color: labelColor,
    opacity: 0.8,
    marginTop: 1,
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[containerStyle, { transform: [{ scale }] }]}>
        {icon !== undefined && (
          <Icon
            name={icon as any}
            size={iconSize}
            color={labelColor}
            style={{ marginRight: 5 }}
          />
        )}
        <View>
          <Text style={labelStyle} numberOfLines={1}>
            {label}
          </Text>
          {sublabel !== undefined && (
            <Text style={sublabelStyle} numberOfLines={1}>
              {sublabel}
            </Text>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default Chip;
