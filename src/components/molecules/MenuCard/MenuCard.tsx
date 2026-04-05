import Icon from '@react-native-vector-icons/material-design-icons';
import React, { useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useTheme } from '../../../theme';
import Badge from '../../atoms/Badge';

type MenuCardProps = {
  title: string;
  description: string;
  implemented: boolean;
  onPress: () => void;
  icon: string;
  iconColor?: string;
};

const MenuCard = ({
  title,
  description,
  implemented,
  onPress,
  icon,
  iconColor,
}: MenuCardProps) => {
  const { colors, spacing, typography, shadows, isDark } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const resolvedIconColor = iconColor ?? colors.primary600;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: spacing.lg,
          borderRadius: 16,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: spacing.md,
          transform: [{ scale }],
          ...shadows.sm,
        }}
      >
        {/* Icon container */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: isDark ? colors.primary900 : colors.primary50,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.md,
          }}
        >
          <Icon name={icon as any} size={22} color={resolvedIconColor} />
        </View>

        {/* Text block */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              ...typography.presets.h3,
              color: colors.textPrimary,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            style={{
              ...typography.presets.bodySmall,
              color: colors.textSecondary,
              marginTop: spacing.xs,
            }}
            numberOfLines={2}
          >
            {description}
          </Text>
          {!implemented && <Badge label="Coming Soon" variant="comingSoon" />}
        </View>

        {/* Chevron */}
        {implemented && (
          <Icon
            name="chevron-right"
            size={20}
            color={colors.textTertiary}
            style={{ marginLeft: spacing.sm }}
          />
        )}
      </Animated.View>
    </Pressable>
  );
};

export default MenuCard;
