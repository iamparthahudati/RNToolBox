import Icon from '@react-native-vector-icons/material-design-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../theme';

type InfoRowProps = {
  label: string;
  value: string;
  valueColor?: string;
  icon?: string;
  multiline?: boolean;
};

const InfoRow = ({
  label,
  value,
  valueColor,
  icon,
  multiline = false,
}: InfoRowProps) => {
  const { colors, spacing, typography } = useTheme();

  if (multiline) {
    return (
      <View
        style={[
          styles.multilineContainer,
          {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
            backgroundColor: colors.surface,
            gap: spacing.xs,
          },
        ]}
      >
        <View style={styles.labelRow}>
          {icon !== undefined && (
            <Icon
              name={icon as any}
              size={13}
              color={colors.textTertiary}
              style={{ marginRight: spacing.xs }}
            />
          )}
          <Text
            style={[
              typography.presets.caption,
              {
                color: colors.textTertiary,
                textTransform: 'uppercase',
                letterSpacing: 0.6,
              },
            ]}
          >
            {label}
          </Text>
        </View>
        <Text
          style={[
            typography.presets.bodySmall,
            {
              color: valueColor ?? colors.textPrimary,
              lineHeight: 20,
              fontWeight: typography.weights.medium as '500',
            },
          ]}
        >
          {value}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.inlineContainer,
        {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
          backgroundColor: colors.surface,
        },
      ]}
    >
      <View style={styles.inlineLabelRow}>
        {icon !== undefined && (
          <Icon
            name={icon as any}
            size={15}
            color={colors.textSecondary}
            style={{ marginRight: spacing.sm }}
          />
        )}
        <Text
          style={[
            typography.presets.bodySmall,
            { color: colors.textSecondary, flex: 1 },
          ]}
        >
          {label}
        </Text>
      </View>
      <Text
        style={[
          typography.presets.bodySmall,
          {
            fontWeight: typography.weights.semibold as '600',
            color: valueColor ?? colors.textPrimary,
            flex: 1,
            textAlign: 'right',
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  multilineContainer: {
    flexDirection: 'column',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inlineLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});

export default InfoRow;
