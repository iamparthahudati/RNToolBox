import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../../theme';

export type BadgeVariant =
  | 'comingSoon'
  | 'success'
  | 'warning'
  | 'error'
  | 'new'
  | 'pro';

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  showDot?: boolean;
};

const Badge = ({
  label,
  variant = 'comingSoon',
  showDot = false,
}: BadgeProps) => {
  const { colors } = useTheme();

  const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
    comingSoon: { bg: colors.warningLight, text: colors.warningMain },
    warning: { bg: colors.warningLight, text: colors.warningMain },
    success: { bg: colors.successLight, text: colors.successMain },
    new: { bg: colors.successLight, text: colors.successMain },
    error: { bg: colors.errorLight, text: colors.errorMain },
    pro: { bg: colors.primary100, text: colors.primary700 },
  };

  const { bg, text } = variantColors[variant];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: bg,
        borderRadius: 8,
        paddingHorizontal: 7,
        paddingVertical: 3,
        alignSelf: 'flex-start',
      }}
    >
      {showDot && (
        <View
          style={{
            width: 5,
            height: 5,
            borderRadius: 3,
            backgroundColor: text,
            marginRight: 5,
          }}
        />
      )}
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          color: text,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

export default Badge;
