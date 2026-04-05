// ---------------------------------------------------------------------------
// RNToolBox Design System — Spacing & Border Radius Tokens
// ---------------------------------------------------------------------------

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
  massive: 80,
} as const;

const radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
} as const;

const tokens = {
  ...spacing,
  radii,
} as const;

export type Spacing = typeof spacing;
export type Radii = typeof radii;
export type SpacingTokens = typeof tokens;

export default tokens;
