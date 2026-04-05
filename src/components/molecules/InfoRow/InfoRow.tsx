import Icon from '@react-native-vector-icons/MaterialDesignIcons';
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../../theme';

type InfoRowProps = {
  label: string;
  value: string;
  valueColor?: string;
  icon?: string;
};

const InfoRow = ({ label, value, valueColor, icon }: InfoRowProps) => {
  const { colors, spacing, typography } = useTheme();

  const iconSize = 15;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {icon !== undefined && (
          <Icon
            name={icon as any}
            size={iconSize}
            color={colors.textSecondary}
            style={{ marginRight: spacing.sm }}
          />
        )}
        <Text
          style={{
            ...typography.presets.bodySmall,
            color: colors.textSecondary,
            flex: 1,
          }}
        >
          {label}
        </Text>
      </View>
      <Text
        style={{
          ...typography.presets.bodySmall,
          fontWeight: typography.weights.semibold as '600',
          color: valueColor ?? colors.textPrimary,
          flex: 1,
          textAlign: 'right',
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {value}
      </Text>
    </View>
  );
};

export default InfoRow;
