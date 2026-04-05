// ─────────────────────────────────────────────────────────────────────────────
// RNToolBox Design System — Color Palette
// Tailwind-inspired scale. No external imports. React Native compatible.
// ─────────────────────────────────────────────────────────────────────────────

// ── Primary Blue Scale ────────────────────────────────────────────────────────
const primary = {
  primary50: '#EFF6FF',
  primary100: '#DBEAFE',
  primary200: '#BFDBFE',
  primary300: '#93C5FD',
  primary400: '#60A5FA',
  primary500: '#3B82F6',
  primary600: '#2563EB',
  primary700: '#1D4ED8',
  primary800: '#1E40AF',
  primary900: '#1E3A8A',
  primary950: '#172554',
} as const;

// ── Neutral / Gray Scale ──────────────────────────────────────────────────────
const neutral = {
  neutral50: '#F8FAFC',
  neutral100: '#F1F5F9',
  neutral200: '#E2E8F0',
  neutral300: '#CBD5E1',
  neutral400: '#94A3B8',
  neutral500: '#64748B',
  neutral600: '#475569',
  neutral700: '#334155',
  neutral800: '#1E293B',
  neutral900: '#0F172A',
  neutral950: '#020617',
} as const;

// ── Status — Success (Green) ──────────────────────────────────────────────────
const success = {
  successLight: '#DCFCE7',
  successMain: '#16A34A',
  successDark: '#14532D',
} as const;

// ── Status — Warning (Amber) ──────────────────────────────────────────────────
const warning = {
  warningLight: '#FEF9C3',
  warningMain: '#D97706',
  warningDark: '#78350F',
} as const;

// ── Status — Error (Red) ──────────────────────────────────────────────────────
const error = {
  errorLight: '#FEE2E2',
  errorMain: '#DC2626',
  errorDark: '#7F1D1D',
} as const;

// ── Status — Info (Blue) ──────────────────────────────────────────────────────
const info = {
  infoLight: '#DBEAFE',
  infoMain: '#2563EB',
  infoDark: '#1E3A8A',
} as const;

// ── Light Mode Semantic Tokens ────────────────────────────────────────────────
const light = {
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#F1F5F9',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textDisabled: '#CBD5E1',
  textInverse: '#F8FAFC',
} as const;

// ── Dark Mode Semantic Tokens ─────────────────────────────────────────────────
const dark = {
  background: '#0F172A',
  surface: '#1E293B',
  surfaceElevated: '#334155',
  border: '#334155',
  borderStrong: '#475569',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  textDisabled: '#475569',
  textInverse: '#0F172A',
} as const;

// ── Gradients ─────────────────────────────────────────────────────────────────
const gradients = {
  primaryGradient: ['#3B82F6', '#2563EB', '#1D4ED8'],
  darkGradient: ['#0F172A', '#1E293B', '#334155'],
  surfaceGradient: ['#F8FAFC', '#F1F5F9', '#E2E8F0'],
} as const;

// ── Base ──────────────────────────────────────────────────────────────────────
const base = {
  white: '#FFFFFF',
  black: '#000000',
} as const;

// ── Composed Export ───────────────────────────────────────────────────────────
const colors = {
  ...primary,
  ...neutral,
  ...success,
  ...warning,
  ...error,
  ...info,
  ...base,
  light,
  dark,
  gradients,
} as const;

export type Colors = typeof colors;
export type LightTokens = typeof light;
export type DarkTokens = typeof dark;
export type GradientKeys = keyof typeof gradients;

export default colors;
