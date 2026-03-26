import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../../../theme';

type ChipProps = {
  label: string;
  sublabel?: string;
  active?: boolean;
  onPress: () => void;
};

const Chip = ({ label, sublabel, active = false, onPress }: ChipProps) => (
  <TouchableOpacity
    style={[styles.chip, active && styles.chipActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text
      style={[styles.label, active && styles.labelActive]}
      numberOfLines={1}
    >
      {label}
    </Text>
    {sublabel !== undefined && (
      <Text
        style={[styles.sublabel, active && styles.labelActive]}
        numberOfLines={1}
      >
        {sublabel}
      </Text>
    )}
  </TouchableOpacity>
);

export default Chip;

const styles = StyleSheet.create({
  chip: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  chipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#EFF6FF',
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  sublabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },
  labelActive: {
    color: theme.colors.primary,
  },
});
