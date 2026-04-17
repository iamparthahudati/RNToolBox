import Color from 'color';
import { WCAG_CRITERIA } from './rules';
import { AuditIssue } from './types';
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const wcagContrast = require('wcag-contrast') as {
  hex(a: string, b: string): number;
};

// ─────────────────────────────────────────────────────────────────────────────
// Static color values extracted from src/theme/colors.ts
// These are read statically so this script has zero runtime dependency on RN.
// ─────────────────────────────────────────────────────────────────────────────

const LIGHT = {
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

const DARK = {
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

const STATUS = {
  successMain: '#16A34A',
  warningMain: '#D97706',
  errorMain: '#DC2626',
  infoMain: '#2563EB',
} as const;

const PRIMARY = {
  primary600: '#2563EB',
  primary700: '#1D4ED8',
} as const;

const WHITE = '#FFFFFF';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ColorPair {
  fgName: string;
  bgName: string;
  fg: string;
  bg: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Normalize a hex color and compute the WCAG contrast ratio. */
function contrastRatio(hex1: string, hex2: string): number {
  return wcagContrast.hex(Color(hex1).hex(), Color(hex2).hex());
}

function buildIssue(
  pair: ColorPair,
  actualRatio: number,
  threshold: number,
  criterionId: '1.4.3' | '1.4.11',
  severity: 'error' | 'warning' | 'info',
): AuditIssue {
  const ruleId =
    criterionId === '1.4.3' ? 'contrast-minimum' : 'non-text-contrast';
  const criterion = WCAG_CRITERIA[ruleId];
  const ratioStr = actualRatio.toFixed(2);

  return {
    ruleId,
    criterion,
    severity,
    filePath: 'src/theme/colors.ts',
    line: 1,
    column: 0,
    message: `Color pair ${pair.fgName} on ${pair.bgName} has contrast ratio ${ratioStr}:1 (required ${threshold}:1)`,
    suggestion: `Darken ${pair.fgName} or lighten ${pair.bgName} to meet WCAG ${criterionId} threshold`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Pair definitions
// ─────────────────────────────────────────────────────────────────────────────

/** WCAG 1.4.3 — Minimum Contrast (text), threshold 4.5:1 */
const TEXT_CONTRAST_PAIRS: ColorPair[] = [
  // Light mode — body text
  {
    fgName: 'light.textPrimary',
    bgName: 'light.background',
    fg: LIGHT.textPrimary,
    bg: LIGHT.background,
  },
  {
    fgName: 'light.textPrimary',
    bgName: 'light.surface',
    fg: LIGHT.textPrimary,
    bg: LIGHT.surface,
  },
  {
    fgName: 'light.textSecondary',
    bgName: 'light.background',
    fg: LIGHT.textSecondary,
    bg: LIGHT.background,
  },
  {
    fgName: 'light.textSecondary',
    bgName: 'light.surface',
    fg: LIGHT.textSecondary,
    bg: LIGHT.surface,
  },
  {
    fgName: 'light.textTertiary',
    bgName: 'light.background',
    fg: LIGHT.textTertiary,
    bg: LIGHT.background,
  },
  // Light mode — inverse / status
  {
    fgName: 'light.textInverse',
    bgName: 'primary600',
    fg: LIGHT.textInverse,
    bg: PRIMARY.primary600,
  },
  { fgName: 'white', bgName: 'errorMain', fg: WHITE, bg: STATUS.errorMain },
  { fgName: 'white', bgName: 'successMain', fg: WHITE, bg: STATUS.successMain },
  { fgName: 'white', bgName: 'warningMain', fg: WHITE, bg: STATUS.warningMain },
  { fgName: 'white', bgName: 'infoMain', fg: WHITE, bg: STATUS.infoMain },
  // Dark mode — body text
  {
    fgName: 'dark.textPrimary',
    bgName: 'dark.background',
    fg: DARK.textPrimary,
    bg: DARK.background,
  },
  {
    fgName: 'dark.textPrimary',
    bgName: 'dark.surface',
    fg: DARK.textPrimary,
    bg: DARK.surface,
  },
  {
    fgName: 'dark.textSecondary',
    bgName: 'dark.background',
    fg: DARK.textSecondary,
    bg: DARK.background,
  },
  {
    fgName: 'dark.textSecondary',
    bgName: 'dark.surface',
    fg: DARK.textSecondary,
    bg: DARK.surface,
  },
  {
    fgName: 'dark.textTertiary',
    bgName: 'dark.background',
    fg: DARK.textTertiary,
    bg: DARK.background,
  },
];

/** WCAG 1.4.11 — Non-text Contrast (UI components / borders), threshold 3:1 */
const NON_TEXT_CONTRAST_PAIRS: ColorPair[] = [
  // Light mode — borders against page backgrounds
  {
    fgName: 'light.border',
    bgName: 'light.background',
    fg: LIGHT.border,
    bg: LIGHT.background,
  },
  {
    fgName: 'light.borderStrong',
    bgName: 'light.background',
    fg: LIGHT.borderStrong,
    bg: LIGHT.background,
  },
  // Dark mode — borders against page backgrounds
  {
    fgName: 'dark.border',
    bgName: 'dark.background',
    fg: DARK.border,
    bg: DARK.background,
  },
  {
    fgName: 'dark.borderStrong',
    bgName: 'dark.background',
    fg: DARK.borderStrong,
    bg: DARK.background,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Statically checks color contrast ratios defined in src/theme/colors.ts
 * against WCAG 2.1 criteria 1.4.3 (text contrast, AA) and 1.4.11
 * (non-text contrast, AA).
 *
 * @param srcDir - Root source directory (unused for static analysis; kept for
 *                 interface consistency with other checkers).
 * @returns Array of AuditIssue for every failing color pair.
 */
export function checkColorContrast(_srcDir: string): AuditIssue[] {
  const issues: AuditIssue[] = [];

  const TEXT_THRESHOLD = 4.5;
  const NON_TEXT_THRESHOLD = 3.0;

  // ── 1.4.3 Text contrast ───────────────────────────────────────────────────
  for (const pair of TEXT_CONTRAST_PAIRS) {
    const r = contrastRatio(pair.fg, pair.bg);
    if (r < TEXT_THRESHOLD) {
      issues.push(buildIssue(pair, r, TEXT_THRESHOLD, '1.4.3', 'error'));
    }
  }

  // ── 1.4.11 Non-text contrast ──────────────────────────────────────────────
  for (const pair of NON_TEXT_CONTRAST_PAIRS) {
    const r = contrastRatio(pair.fg, pair.bg);
    if (r < NON_TEXT_THRESHOLD) {
      issues.push(buildIssue(pair, r, NON_TEXT_THRESHOLD, '1.4.11', 'warning'));
    }
  }

  return issues;
}
