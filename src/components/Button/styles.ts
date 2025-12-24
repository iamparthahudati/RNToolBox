import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

export const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },

  fullWidth: {
    width: '100%',
  },

  primary: {
    backgroundColor: theme.colors.primary,
  },

  secondary: {
    backgroundColor: theme.colors.success,
  },

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },

  disabled: {
    opacity: 0.5,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    marginHorizontal: theme.spacing.sm,
  },

  text: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
  },

  primaryText: {
    color: theme.colors.white,
  },

  secondaryText: {
    color: theme.colors.white,
  },

  outlineText: {
    color: theme.colors.primary,
  },
});
