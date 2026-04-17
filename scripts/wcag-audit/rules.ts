import { WCAGCriterion, WCAGPrinciple } from './types';

const { PERCEIVABLE, OPERABLE, UNDERSTANDABLE } = WCAGPrinciple;

// ---------------------------------------------------------------------------
// WCAG 2.2 rule definitions
// Key  = ruleId used throughout the audit engine
// ---------------------------------------------------------------------------

export const WCAG_CRITERIA: Record<string, WCAGCriterion> = {
  'non-text-content': {
    id: '1.1.1',
    level: 'A',
    principle: PERCEIVABLE,
    title: 'Non-text Content',
    weight: 10,
  },

  'info-relationships': {
    id: '1.3.1',
    level: 'A',
    principle: PERCEIVABLE,
    title: 'Info and Relationships',
    weight: 8,
  },

  'contrast-minimum': {
    id: '1.4.3',
    level: 'AA',
    principle: PERCEIVABLE,
    title: 'Contrast (Minimum)',
    weight: 12,
  },

  'resize-text': {
    id: '1.4.4',
    level: 'AA',
    principle: PERCEIVABLE,
    title: 'Resize Text',
    weight: 8,
  },

  'non-text-contrast': {
    id: '1.4.11',
    level: 'AA',
    principle: PERCEIVABLE,
    title: 'Non-text Contrast',
    weight: 10,
  },

  keyboard: {
    id: '2.1.1',
    level: 'A',
    principle: OPERABLE,
    title: 'Keyboard / Switch Access',
    weight: 10,
  },

  'focus-order': {
    id: '2.4.3',
    level: 'A',
    principle: OPERABLE,
    title: 'Focus Order',
    weight: 8,
  },

  'label-in-name': {
    id: '2.5.3',
    level: 'AA',
    principle: OPERABLE,
    title: 'Label in Name',
    weight: 8,
  },

  'target-size': {
    id: '2.5.8',
    level: 'AA',
    principle: OPERABLE,
    title: 'Target Size (Minimum)',
    weight: 10,
  },

  'labels-instructions': {
    id: '3.3.2',
    level: 'A',
    principle: UNDERSTANDABLE,
    title: 'Labels or Instructions',
    weight: 8,
  },
};

// ---------------------------------------------------------------------------
// Derived constants
// ---------------------------------------------------------------------------

/** Sum of all criterion weights — used as the denominator for score calculation. */
export const TOTAL_WEIGHT: number = Object.values(WCAG_CRITERIA).reduce(
  (sum, criterion) => sum + criterion.weight,
  0,
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Look up a {@link WCAGCriterion} by its rule identifier.
 *
 * @param ruleId - The rule key as defined in {@link WCAG_CRITERIA}.
 * @throws {Error} When the ruleId is not registered.
 */
export function getCriterionByRuleId(ruleId: string): WCAGCriterion {
  const criterion = WCAG_CRITERIA[ruleId];
  if (!criterion) {
    throw new Error(
      `Unknown WCAG rule id: "${ruleId}". ` +
        `Valid ids are: ${Object.keys(WCAG_CRITERIA).join(', ')}.`,
    );
  }
  return criterion;
}
