// ---------------------------------------------------------------------------
// RNToolBox Design System — Unified Theme Export
// ---------------------------------------------------------------------------

import { useColorScheme } from 'react-native';
import colors from './colors';
import shadows from './shadows';
import spacing from './spacing';
import typography from './typography';

export const theme = {
  colors: {
    // Semantic light-mode tokens (flat, for use in StyleSheet)
    ...colors.light,
    // Status colors
    error: colors.errorMain,
    errorLight: colors.errorLight,
    errorDark: colors.errorDark,
    success: colors.successMain,
    successLight: colors.successLight,
    successDark: colors.successDark,
    warning: colors.warningMain,
    warningLight: colors.warningLight,
    warningDark: colors.warningDark,
    info: colors.infoMain,
    infoLight: colors.infoLight,
    infoDark: colors.infoDark,
    // Primary scale
    primary: colors.primary600,
    primary50: colors.primary50,
    primary100: colors.primary100,
    primary200: colors.primary200,
    primary300: colors.primary300,
    primary400: colors.primary400,
    primary500: colors.primary500,
    primary600: colors.primary600,
    primary700: colors.primary700,
    primary800: colors.primary800,
    primary900: colors.primary900,
    primary950: colors.primary950,
    // Neutral scale
    neutral50: colors.neutral50,
    neutral100: colors.neutral100,
    neutral200: colors.neutral200,
    neutral300: colors.neutral300,
    neutral400: colors.neutral400,
    neutral500: colors.neutral500,
    neutral600: colors.neutral600,
    neutral700: colors.neutral700,
    neutral800: colors.neutral800,
    neutral900: colors.neutral900,
    neutral950: colors.neutral950,
    // Base
    white: colors.white,
    black: colors.black,
    gradients: colors.gradients,
    // Raw nested tokens still accessible if needed
    light: colors.light,
    dark: colors.dark,
  },
  spacing,
  typography,
  shadows,
} as const;

export type Theme = typeof theme;

// ---------------------------------------------------------------------------
// useTheme — reactive hook that returns mode-aware semantic color tokens
// alongside all other design tokens. Use this inside components.
//
// Usage:
//   const { colors: c, spacing: s, typography: t, shadows: sh, isDark } = useTheme();
//   <View style={{ backgroundColor: c.background, padding: s.lg }} />
// ---------------------------------------------------------------------------

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Semantic tokens resolved for the current mode
  const semanticColors = isDark ? colors.dark : colors.light;

  // Shadow scale resolved for the current mode
  const shadowScale = isDark ? shadows.dark : shadows.light;

  return {
    isDark,
    // Semantic (mode-aware) color tokens — use these in components
    colors: {
      ...semanticColors,
      // Always-available raw scales and status colors
      primary: colors.primary600,
      primary50: colors.primary50,
      primary100: colors.primary100,
      primary200: colors.primary200,
      primary300: colors.primary300,
      primary400: colors.primary400,
      primary500: colors.primary500,
      primary600: colors.primary600,
      primary700: colors.primary700,
      primary800: colors.primary800,
      primary900: colors.primary900,
      primary950: colors.primary950,
      neutral50: colors.neutral50,
      neutral100: colors.neutral100,
      neutral200: colors.neutral200,
      neutral300: colors.neutral300,
      neutral400: colors.neutral400,
      neutral500: colors.neutral500,
      neutral600: colors.neutral600,
      neutral700: colors.neutral700,
      neutral800: colors.neutral800,
      neutral900: colors.neutral900,
      neutral950: colors.neutral950,
      successLight: colors.successLight,
      successMain: colors.successMain,
      successDark: colors.successDark,
      warningLight: colors.warningLight,
      warningMain: colors.warningMain,
      warningDark: colors.warningDark,
      errorLight: colors.errorLight,
      errorMain: colors.errorMain,
      errorDark: colors.errorDark,
      infoLight: colors.infoLight,
      infoMain: colors.infoMain,
      infoDark: colors.infoDark,
      white: colors.white,
      black: colors.black,
      gradients: colors.gradients,
    },
    spacing,
    typography,
    // Mode-aware shadow scale
    shadows: shadowScale,
    // Raw glow tokens (not mode-specific)
    glow: shadows.glow,
    // Raw token access if needed
    rawColors: colors,
    rawShadows: shadows,
  } as const;
}

// ---------------------------------------------------------------------------
// Re-exports for convenience
// ---------------------------------------------------------------------------

export { default as colors } from './colors';
export type { Colors, DarkTokens, GradientKeys, LightTokens } from './colors';
export { default as shadows } from './shadows';
export type {
  GlowScale,
  GlowToken,
  ShadowScale,
  ShadowToken,
  ShadowTokens,
} from './shadows';
export { default as spacing } from './spacing';
export type { Radii, Spacing, SpacingTokens } from './spacing';
export { default as typography } from './typography';
export type { FontSize, FontWeight, TypographyPreset } from './typography';
