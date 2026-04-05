// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ShadowToken {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface GlowToken {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ShadowScale {
  none: ShadowToken;
  xs: ShadowToken;
  sm: ShadowToken;
  md: ShadowToken;
  lg: ShadowToken;
  xl: ShadowToken;
}

export interface GlowScale {
  primary: GlowToken;
  success: GlowToken;
  error: GlowToken;
}

export interface ShadowTokens {
  light: ShadowScale;
  dark: ShadowScale;
  glow: GlowScale;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const shadow = (
  height: number,
  opacity: number,
  radius: number,
  elevation: number,
  color: string = '#000000',
): ShadowToken => ({
  shadowColor: color,
  shadowOffset: { width: 0, height },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

const glow = (
  color: string,
  opacity: number,
  radius: number,
  elevation: number,
): GlowToken => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

// ---------------------------------------------------------------------------
// Light mode — black shadows, low opacity, crisp offsets
// ---------------------------------------------------------------------------

const light: ShadowScale = {
  none: shadow(0, 0, 0, 0),
  xs: shadow(1, 0.04, 2, 1),
  sm: shadow(1, 0.06, 4, 2),
  md: shadow(2, 0.08, 8, 4),
  lg: shadow(4, 0.1, 12, 8),
  xl: shadow(6, 0.12, 20, 12),
};

// ---------------------------------------------------------------------------
// Dark mode — black shadows, slightly higher opacity, lower elevation
// Surfaces are already dark so shadows need more contrast to read
// ---------------------------------------------------------------------------

const dark: ShadowScale = {
  none: shadow(0, 0, 0, 0),
  xs: shadow(1, 0.2, 2, 1),
  sm: shadow(1, 0.28, 4, 2),
  md: shadow(2, 0.36, 8, 3),
  lg: shadow(4, 0.44, 12, 6),
  xl: shadow(6, 0.52, 20, 9),
};

// ---------------------------------------------------------------------------
// Glow tokens — coloured shadows for interactive / status elements
// ---------------------------------------------------------------------------

const glowTokens: GlowScale = {
  // Blue — primary action buttons, focused inputs
  primary: glow('#2563EB', 0.4, 12, 6),
  // Green — success states, confirmations
  success: glow('#16A34A', 0.38, 12, 6),
  // Red — error states, destructive actions
  error: glow('#DC2626', 0.38, 12, 6),
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

const shadows: ShadowTokens = {
  light,
  dark,
  glow: glowTokens,
};

export default shadows;
