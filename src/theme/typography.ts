import { TextStyle } from 'react-native';

// ---------------------------------------------------------------------------
// Font Families
// ---------------------------------------------------------------------------

const fontFamily = {
  sans: 'Inter, -apple-system, BlinkMacSystemFont, SF Pro Text, Segoe UI, Helvetica Neue, Arial, sans-serif',
  mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
} as const;

// ---------------------------------------------------------------------------
// Size Scale  (sp — React Native uses unitless numbers)
// ---------------------------------------------------------------------------

const sizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  display: 32,
  hero: 40,
} as const;

// ---------------------------------------------------------------------------
// Font Weights
// ---------------------------------------------------------------------------

const weights = {
  thin: '100',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

// ---------------------------------------------------------------------------
// Line Heights  (multipliers — multiply against fontSize at usage site)
// ---------------------------------------------------------------------------

const lineHeights = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.65,
} as const;

// ---------------------------------------------------------------------------
// Letter Spacing  (React Native uses raw point values)
// ---------------------------------------------------------------------------

const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1.5,
} as const;

// ---------------------------------------------------------------------------
// Presets  — flat, ready-to-spread TextStyle objects
// lineHeight is expressed as an absolute pixel value derived from the
// multiplier × fontSize so React Native renders it correctly.
// ---------------------------------------------------------------------------

const presets = {
  /** Large marketing / splash headline */
  hero: {
    fontFamily: fontFamily.sans,
    fontSize: sizes.hero,
    fontWeight: weights.bold,
    lineHeight: Math.round(sizes.hero * lineHeights.tight),
    letterSpacing: letterSpacing.tighter,
  } satisfies TextStyle,

  /** Section-level display heading */
  display: {
    fontFamily: fontFamily.sans,
    fontSize: sizes.display,
    fontWeight: weights.bold,
    lineHeight: Math.round(sizes.display * lineHeights.tight),
    letterSpacing: letterSpacing.tighter,
  } satisfies TextStyle,

  /** Page / screen title */
  h1: {
    fontFamily: fontFamily.sans,
    fontSize: sizes.xxl,
    fontWeight: weights.semibold,
    lineHeight: Math.round(sizes.xxl * lineHeights.snug),
    letterSpacing: letterSpacing.tight,
  } satisfies TextStyle,

  /** Card / panel heading */
  h2: {
    fontFamily: fontFamily.sans,
    fontSize: sizes.xl,
    fontWeight: weights.semibold,
    lineHeight: Math.round(sizes.xl * lineHeights.snug),
    letterSpacing: letterSpacing.tight,
  } satisfies TextStyle,

  /** Sub-section heading */
  h3: {
    fontFamily: fontFamily.sans,
    fontSize: sizes.lg,
    fontWeight: weights.medium,
    lineHeight: Math.round(sizes.lg * lineHeights.snug),
    letterSpacing: letterSpacing.normal,
  } satisfies TextStyle,

  /** Default body copy */
  body: {
    fontFamily: fontFamily.sans,
    fontSize: sizes.md,
    fontWeight: weights.regular,
    lineHeight: Math.round(sizes.md * lineHeights.normal),
    letterSpacing: letterSpacing.normal,
  } satisfies TextStyle,

  /** Secondary / supporting body text */
  bodySmall: {
    fontFamily: fontFamily.sans,
    fontSize: sizes.sm,
    fontWeight: weights.regular,
    lineHeight: Math.round(sizes.sm * lineHeights.normal),
    letterSpacing: letterSpacing.normal,
  } satisfies TextStyle,

  /** Image captions, timestamps, fine print */
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: sizes.xs,
    fontWeight: weights.regular,
    lineHeight: Math.round(sizes.xs * lineHeights.normal),
    letterSpacing: letterSpacing.wide,
  } satisfies TextStyle,

  /** Form labels, button text, nav items */
  label: {
    fontFamily: fontFamily.sans,
    fontSize: sizes.sm,
    fontWeight: weights.medium,
    lineHeight: Math.round(sizes.sm * lineHeights.snug),
    letterSpacing: letterSpacing.wide,
  } satisfies TextStyle,

  /** Inline code snippets and code blocks */
  code: {
    fontFamily: fontFamily.mono,
    fontSize: sizes.sm,
    fontWeight: weights.regular,
    lineHeight: Math.round(sizes.sm * lineHeights.relaxed),
    letterSpacing: letterSpacing.normal,
  } satisfies TextStyle,

  /** ALL-CAPS category / tag labels */
  overline: {
    fontFamily: fontFamily.sans,
    fontSize: sizes.xs,
    fontWeight: weights.semibold,
    lineHeight: Math.round(sizes.xs * lineHeights.snug),
    letterSpacing: letterSpacing.widest,
  } satisfies TextStyle,
} as const;

// ---------------------------------------------------------------------------
// Composed export
// ---------------------------------------------------------------------------

const typography = {
  fontFamily,
  sizes,
  weights,
  lineHeights,
  letterSpacing,
  presets,
} as const;

export type TypographyPreset = keyof typeof presets;
export type FontWeight = keyof typeof weights;
export type FontSize = keyof typeof sizes;

export default typography;
