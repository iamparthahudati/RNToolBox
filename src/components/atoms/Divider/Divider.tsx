import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../../theme';

type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';
type DividerVariant = 'solid' | 'dashed';

type DividerProps = {
  horizontal?: boolean;
  label?: string;
  spacing?: DividerSpacing;
  variant?: DividerVariant;
};

const Divider = ({
  horizontal = true,
  label,
  spacing = 'none',
  variant = 'solid',
}: DividerProps) => {
  const { colors, typography, spacing: s } = useTheme();

  const spacingMap: Record<DividerSpacing, number> = {
    none: 0,
    sm: s.sm,
    md: s.md,
    lg: s.lg,
  };

  const verticalMargin = spacingMap[spacing];

  const lineStyle = {
    borderColor: colors.border,
    borderStyle: variant as 'solid' | 'dashed',
  };

  if (!horizontal) {
    return (
      <View
        style={{
          width: 1,
          alignSelf: 'stretch' as const,
          borderLeftWidth: 1,
          marginHorizontal: verticalMargin,
          ...lineStyle,
        }}
      />
    );
  }

  if (label !== undefined) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: verticalMargin,
        }}
      >
        <View
          style={{
            flex: 1,
            height: 1,
            borderTopWidth: 1,
            ...lineStyle,
          }}
        />
        <Text
          style={{
            marginHorizontal: s.sm,
            ...typography.presets.caption,
            color: colors.textTertiary,
          }}
        >
          {label}
        </Text>
        <View
          style={{
            flex: 1,
            height: 1,
            borderTopWidth: 1,
            ...lineStyle,
          }}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        height: 1,
        width: '100%',
        borderTopWidth: 1,
        marginVertical: verticalMargin,
        ...lineStyle,
      }}
    />
  );
};

export default Divider;
