import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../theme';

type BadgeVariant = 'comingSoon' | 'success' | 'warning' | 'error';

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  comingSoon: { bg: '#FEF2F2', text: '#DC2626' },
  success: { bg: '#F0FDF4', text: '#16A34A' },
  warning: { bg: '#FFFBEB', text: '#F59E0B' },
  error: { bg: '#FEF2F2', text: '#DC2626' },
};

const Badge = ({ label, variant = 'comingSoon' }: BadgeProps) => {
  const variantStyle = VARIANT_STYLES[variant];
  return (
    <View style={[styles.badge, { backgroundColor: variantStyle.bg }]}>
      <Text style={[styles.text, { color: variantStyle.text }]}>{label}</Text>
    </View>
  );
};

export default Badge;

const styles = StyleSheet.create({
  badge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.xs,
  },
  text: {
    fontSize: 10,
    fontWeight: '600',
  },
});
