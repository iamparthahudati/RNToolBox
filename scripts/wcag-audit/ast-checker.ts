import { TSESTree } from '@typescript-eslint/types';
import { WCAG_CRITERIA } from './rules';
import { AuditIssue } from './types';

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const parser = require('@typescript-eslint/parser') as {
  parse(code: string, options: Record<string, unknown>): TSESTree.Program;
};
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs: { readFileSync(path: string, enc: 'utf-8'): string } = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const wcagContrast = require('wcag-contrast') as {
  hex(a: string, b: string): number;
};
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const Color = require('color') as (hex: string) => { hex(): string };

function makeIssue(
  ruleId: string,
  node: TSESTree.JSXOpeningElement,
  message: string,
  suggestion: string,
  severity: 'error' | 'warning' | 'info' = 'warning',
): AuditIssue {
  return {
    ruleId,
    criterion: WCAG_CRITERIA[ruleId],
    severity,
    filePath: '', // stamped by checkFile after traversal
    line: node.loc.start.line,
    column: node.loc.start.column,
    message,
    suggestion,
  };
}

function getJSXAttr(
  node: TSESTree.JSXOpeningElement,
  name: string,
): TSESTree.JSXAttribute | undefined {
  return node.attributes.find(
    (attr): attr is TSESTree.JSXAttribute =>
      attr.type === 'JSXAttribute' &&
      ((attr.name.type === 'JSXIdentifier' && attr.name.name === name) ||
        (attr.name.type === 'JSXNamespacedName' &&
          attr.name.name.name === name)),
  );
}

function getAttrStringValue(attr: TSESTree.JSXAttribute): string | null {
  const { value } = attr;
  if (!value) return null;

  // accessibilityLabel="foo"
  if (value.type === 'Literal' && typeof value.value === 'string') {
    return value.value;
  }

  // accessibilityLabel={"foo"}
  if (
    value.type === 'JSXExpressionContainer' &&
    value.expression.type === 'Literal' &&
    typeof (value.expression as TSESTree.Literal).value === 'string'
  ) {
    return (value.expression as TSESTree.Literal).value as string;
  }

  return null;
}

function getAttrNumericValue(attr: TSESTree.JSXAttribute): number | null {
  const { value } = attr;
  if (!value) return null;

  if (value.type === 'Literal' && typeof value.value === 'number') {
    return value.value;
  }

  if (
    value.type === 'JSXExpressionContainer' &&
    value.expression.type === 'Literal' &&
    typeof (value.expression as TSESTree.Literal).value === 'number'
  ) {
    return (value.expression as TSESTree.Literal).value as number;
  }

  return null;
}

function getAttrBoolValue(attr: TSESTree.JSXAttribute): boolean | null {
  const { value } = attr;

  // <Component flag /> — shorthand boolean true
  if (value === null) return true;

  if (value.type === 'Literal' && typeof value.value === 'boolean') {
    return value.value;
  }

  if (
    value.type === 'JSXExpressionContainer' &&
    value.expression.type === 'Literal' &&
    typeof (value.expression as TSESTree.Literal).value === 'boolean'
  ) {
    return (value.expression as TSESTree.Literal).value as boolean;
  }

  return null;
}

function getComponentName(node: TSESTree.JSXOpeningElement): string {
  const { name } = node;
  if (name.type === 'JSXIdentifier') return name.name;
  if (name.type === 'JSXMemberExpression') return name.property.name;
  if (name.type === 'JSXNamespacedName') return name.name.name;
  return '';
}

function traverseAST(
  node: unknown,
  visitors: Record<string, (n: unknown) => void>,
): void {
  if (!node || typeof node !== 'object') return;

  const n = node as Record<string, unknown>;

  if (typeof n['type'] === 'string' && visitors[n['type']]) {
    visitors[n['type']](n);
  }

  for (const key of Object.keys(n)) {
    if (key === 'parent') continue;
    const child = n[key];
    if (Array.isArray(child)) {
      for (const item of child) {
        traverseAST(item, visitors);
      }
    } else if (
      child &&
      typeof child === 'object' &&
      (child as Record<string, unknown>)['type']
    ) {
      traverseAST(child, visitors);
    }
  }
}

// ---------------------------------------------------------------------------
// Component name sets
// ---------------------------------------------------------------------------

/** Non-text visual elements that require accessibilityLabel (1.1.1) */
const IMAGE_COMPONENTS = new Set([
  'Image',
  'ImageBackground',
  'Icon',
  'SvgXml',
  'FastImage',
  'ActivityIndicator',
]);

/** Interactive components that require accessibilityRole (1.3.1) */
const TOUCHABLE_COMPONENTS = new Set([
  'TouchableOpacity',
  'Pressable',
  'TouchableHighlight',
  'TouchableWithoutFeedback',
]);

/** Interactive components checked for empty accessibilityLabel (2.5.3) */
const TOUCHABLE_LABEL_COMPONENTS = new Set([
  'TouchableOpacity',
  'Pressable',
  'TouchableHighlight',
]);

/** Interactive components checked for minimum touch target size (2.5.8) */
const TOUCHABLE_SIZE_COMPONENTS = new Set([
  'TouchableOpacity',
  'Pressable',
  'TouchableHighlight',
]);

// ---------------------------------------------------------------------------
// Decorative element helper
// ---------------------------------------------------------------------------

/**
 * Returns true if the element is explicitly hidden from the accessibility tree,
 * meaning it is purely decorative and should be exempt from a11y label checks.
 *
 * Exemption conditions:
 *   - accessible={false}
 *   - importantForAccessibility="no" | "no-hide-descendants"  (Android)
 *   - accessibilityElementsHidden={true}  (iOS)
 */
function isDecorativeElement(node: TSESTree.JSXOpeningElement): boolean {
  const accessibleAttr = getJSXAttr(node, 'accessible');
  if (accessibleAttr && getAttrBoolValue(accessibleAttr) === false) return true;

  const ifaAttr = getJSXAttr(node, 'importantForAccessibility');
  if (ifaAttr) {
    const val = getAttrStringValue(ifaAttr);
    if (val === 'no' || val === 'no-hide-descendants') return true;
  }

  const aehAttr = getJSXAttr(node, 'accessibilityElementsHidden');
  if (aehAttr && getAttrBoolValue(aehAttr) === true) return true;

  return false;
}

/**
 * 1.1.1 — Non-text Content
 * Image/ImageBackground/Icon/SvgXml/FastImage/ActivityIndicator must have a
 * non-empty accessibilityLabel UNLESS they are explicitly marked decorative via
 * accessible={false} or importantForAccessibility="no"/"no-hide-descendants".
 */
function checkNonTextContent(
  node: TSESTree.JSXOpeningElement,
  issues: AuditIssue[],
): void {
  const name = getComponentName(node);
  if (!IMAGE_COMPONENTS.has(name)) return;

  // Decorative exemption — explicitly hidden from a11y tree
  if (isDecorativeElement(node)) return;

  const attr = getJSXAttr(node, 'accessibilityLabel');
  const missing = !attr;
  const empty =
    attr !== undefined &&
    getAttrStringValue(attr) !== null &&
    (getAttrStringValue(attr) ?? '').trim() === '';

  if (missing || empty) {
    issues.push(
      makeIssue(
        'non-text-content',
        node,
        `${name} is missing accessibilityLabel`,
        missing
          ? `Add accessibilityLabel="description of ${name.toLowerCase()}" to convey meaning to screen reader users, or add accessible={false} if purely decorative`
          : `accessibilityLabel on ${name} is empty — provide a meaningful description or mark as accessible={false} if decorative`,
        'error',
      ),
    );
  }
}

/**
 * 1.3.1 — Info and Relationships
 * Touchable components must declare accessibilityRole.
 */
function checkInfoRelationships(
  node: TSESTree.JSXOpeningElement,
  issues: AuditIssue[],
): void {
  const name = getComponentName(node);
  if (!TOUCHABLE_COMPONENTS.has(name)) return;

  if (!getJSXAttr(node, 'accessibilityRole')) {
    issues.push(
      makeIssue(
        'info-relationships',
        node,
        `${name} is missing accessibilityRole`,
        'Add accessibilityRole="button" (or appropriate role) so assistive technologies announce the element type',
        'warning',
      ),
    );
  }
}

/**
 * 1.4.4 — Resize Text
 * Text must not disable font scaling or cap it below 2×.
 */
function checkResizeText(
  node: TSESTree.JSXOpeningElement,
  issues: AuditIssue[],
): void {
  const name = getComponentName(node);
  if (name !== 'Text') return;

  const allowFontScalingAttr = getJSXAttr(node, 'allowFontScaling');
  if (
    allowFontScalingAttr &&
    getAttrBoolValue(allowFontScalingAttr) === false
  ) {
    issues.push(
      makeIssue(
        'resize-text',
        node,
        'allowFontScaling={false} prevents text from scaling with system font size',
        'Remove allowFontScaling={false} or set it to true to respect user font size preferences',
        'error',
      ),
    );
  }

  const maxMultiplierAttr = getJSXAttr(node, 'maxFontSizeMultiplier');
  if (maxMultiplierAttr) {
    const numVal = getAttrNumericValue(maxMultiplierAttr);
    if (numVal !== null && numVal < 2) {
      issues.push(
        makeIssue(
          'resize-text',
          node,
          `maxFontSizeMultiplier={${numVal}} is below the recommended minimum of 2`,
          'Set maxFontSizeMultiplier={2} or higher, or remove it to allow full scaling',
          'warning',
        ),
      );
    }
  }
}

/**
 * 2.1.1 — Keyboard / Switch Access
 * A View with onPress must also have accessible={true}.
 */
function checkKeyboard(
  node: TSESTree.JSXOpeningElement,
  issues: AuditIssue[],
): void {
  const name = getComponentName(node);
  if (name !== 'View') return;

  if (!getJSXAttr(node, 'onPress')) return;

  const accessibleAttr = getJSXAttr(node, 'accessible');
  const isAccessible = accessibleAttr ? getAttrBoolValue(accessibleAttr) : null;

  if (!accessibleAttr || isAccessible === false) {
    issues.push(
      makeIssue(
        'keyboard',
        node,
        'View with onPress handler is missing accessible={true}',
        'Add accessible={true} and accessibilityRole to make this View reachable by keyboard/switch access users',
        'warning',
      ),
    );
  }
}

/**
 * 2.4.3 — Focus Order
 * Modal must set accessibilityViewIsModal={true} to trap focus.
 */
function checkFocusOrder(
  node: TSESTree.JSXOpeningElement,
  issues: AuditIssue[],
): void {
  const name = getComponentName(node);
  if (name !== 'Modal') return;

  const attr = getJSXAttr(node, 'accessibilityViewIsModal');
  const val = attr ? getAttrBoolValue(attr) : null;

  if (!attr || val === false) {
    issues.push(
      makeIssue(
        'focus-order',
        node,
        'Modal is missing accessibilityViewIsModal={true}',
        'Add accessibilityViewIsModal={true} to trap focus within the modal for screen reader users',
        'warning',
      ),
    );
  }
}

/**
 * 2.5.3 — Label in Name
 * Touchable components must not have an empty accessibilityLabel.
 */
function checkLabelInName(
  node: TSESTree.JSXOpeningElement,
  issues: AuditIssue[],
): void {
  const name = getComponentName(node);
  if (!TOUCHABLE_LABEL_COMPONENTS.has(name)) return;

  const attr = getJSXAttr(node, 'accessibilityLabel');
  if (!attr) return;

  const val = getAttrStringValue(attr);
  if (val !== null && val.trim() === '') {
    issues.push(
      makeIssue(
        'label-in-name',
        node,
        `accessibilityLabel is empty on ${name}`,
        'Ensure accessibilityLabel contains the visible button text so voice control users can activate it by speaking the label',
        'warning',
      ),
    );
  }
}

/**
 * 2.5.8 — Target Size (Minimum)
 * Touch targets with inline style objects must be at least 24pt in each dimension.
 */
function checkTargetSize(
  node: TSESTree.JSXOpeningElement,
  issues: AuditIssue[],
): void {
  const name = getComponentName(node);
  if (!TOUCHABLE_SIZE_COMPONENTS.has(name)) return;

  const styleAttr = getJSXAttr(node, 'style');
  if (!styleAttr?.value) return;

  const { value } = styleAttr;
  if (value.type !== 'JSXExpressionContainer') return;

  const expr = value.expression;
  if (expr.type !== 'ObjectExpression') return;

  for (const prop of (expr as TSESTree.ObjectExpression).properties) {
    if (prop.type !== 'Property') continue;

    const property = prop as TSESTree.Property;
    const keyName =
      property.key.type === 'Identifier'
        ? (property.key as TSESTree.Identifier).name
        : property.key.type === 'Literal'
        ? String((property.key as TSESTree.Literal).value)
        : null;

    if (keyName !== 'width' && keyName !== 'height') continue;

    const propVal = property.value;
    if (propVal.type !== 'Literal') continue;

    const numVal = (propVal as TSESTree.Literal).value;
    if (typeof numVal !== 'number') continue;

    if (numVal < 24) {
      issues.push(
        makeIssue(
          'target-size',
          node,
          `Touch target ${name} has ${keyName}=${numVal}pt which is below the WCAG 2.5.8 minimum of 24pt`,
          'Set minimum width and height to 24pt on touch targets. Recommended is 44pt for comfortable touch',
          'warning',
        ),
      );
    }
  }
}

/**
 * 3.3.2 — Labels or Instructions
 * TextInput must have a non-empty accessibilityLabel.
 */
function checkLabelsInstructions(
  node: TSESTree.JSXOpeningElement,
  issues: AuditIssue[],
): void {
  const name = getComponentName(node);
  if (name !== 'TextInput') return;

  const attr = getJSXAttr(node, 'accessibilityLabel');
  const missing = !attr;
  const empty = attr
    ? (getAttrStringValue(attr) ?? '').trim() === '' &&
      getAttrStringValue(attr) !== null
    : false;

  if (missing || empty) {
    issues.push(
      makeIssue(
        'labels-instructions',
        node,
        'TextInput is missing accessibilityLabel',
        'Add accessibilityLabel="field description" to TextInput so screen readers announce the field purpose',
        'error',
      ),
    );
  }
}

/**
 * 1.1.1 — Non-text Content (extended)
 * ActivityIndicator used as a loading state must have accessibilityLabel so
 * screen readers announce "Loading" rather than silence.
 * (Already covered by IMAGE_COMPONENTS set — this note is for documentation.)
 *
 * 1.3.1 — Info and Relationships (extended)
 * Switch must have accessibilityRole="switch" and accessibilityLabel.
 */
function checkSwitch(
  node: TSESTree.JSXOpeningElement,
  issues: AuditIssue[],
): void {
  const name = getComponentName(node);
  if (name !== 'Switch') return;

  // Must have accessibilityLabel (3.3.2 / 1.1.1 overlap — use labels-instructions)
  const labelAttr = getJSXAttr(node, 'accessibilityLabel');
  const labelMissing = !labelAttr;
  const labelEmpty =
    labelAttr !== undefined &&
    getAttrStringValue(labelAttr) !== null &&
    (getAttrStringValue(labelAttr) ?? '').trim() === '';

  if (labelMissing || labelEmpty) {
    issues.push(
      makeIssue(
        'labels-instructions',
        node,
        'Switch is missing accessibilityLabel',
        'Add accessibilityLabel="Toggle [feature name]" so screen readers announce the purpose of this switch',
        'error',
      ),
    );
  }

  // Must have accessibilityRole="switch" (1.3.1)
  const roleAttr = getJSXAttr(node, 'accessibilityRole');
  if (!roleAttr) {
    issues.push(
      makeIssue(
        'info-relationships',
        node,
        'Switch is missing accessibilityRole="switch"',
        'Add accessibilityRole="switch" so assistive technologies announce this as a toggle control',
        'warning',
      ),
    );
  }
}

/**
 * 1.3.1 — Info and Relationships (extended)
 * FlatList used as a navigable list should have accessibilityLabel describing
 * the list content, and accessibilityRole="list" is recommended.
 */
function checkFlatList(
  node: TSESTree.JSXOpeningElement,
  issues: AuditIssue[],
): void {
  const name = getComponentName(node);
  if (name !== 'FlatList') return;

  const labelAttr = getJSXAttr(node, 'accessibilityLabel');
  if (!labelAttr) {
    issues.push(
      makeIssue(
        'info-relationships',
        node,
        'FlatList is missing accessibilityLabel',
        'Add accessibilityLabel="List of [items]" so screen readers announce the list purpose when focused',
        'warning',
      ),
    );
  }
}

/**
 * 1.3.1 — Info and Relationships (extended)
 * ScrollView used as a primary content region should have accessibilityLabel
 * and accessibilityRole="scrollbar" or a descriptive label.
 * Only flagged when it has no accessibilityLabel at all.
 */
function checkScrollView(
  node: TSESTree.JSXOpeningElement,
  issues: AuditIssue[],
): void {
  const name = getComponentName(node);
  if (name !== 'ScrollView') return;

  // Only flag if it has no label AND no role — many ScrollViews are layout-only
  const labelAttr = getJSXAttr(node, 'accessibilityLabel');
  const roleAttr = getJSXAttr(node, 'accessibilityRole');

  if (!labelAttr && !roleAttr) {
    issues.push(
      makeIssue(
        'info-relationships',
        node,
        'ScrollView is missing accessibilityLabel and accessibilityRole',
        'Add accessibilityLabel="[content description]" and accessibilityRole="scrollbar" if this is a primary scrollable region',
        'info',
      ),
    );
  }
}

/**
 * 2.1.1 — Keyboard / Switch Access (extended)
 * Text with onPress must have accessible={true} and accessibilityRole.
 * Plain Text is not keyboard-focusable by default.
 */
function checkInteractiveText(
  node: TSESTree.JSXOpeningElement,
  issues: AuditIssue[],
): void {
  const name = getComponentName(node);
  if (name !== 'Text') return;

  if (!getJSXAttr(node, 'onPress')) return;

  const accessibleAttr = getJSXAttr(node, 'accessible');
  const roleAttr = getJSXAttr(node, 'accessibilityRole');

  if (!accessibleAttr || getAttrBoolValue(accessibleAttr) === false) {
    issues.push(
      makeIssue(
        'keyboard',
        node,
        'Text with onPress is missing accessible={true}',
        'Add accessible={true} and accessibilityRole="button" (or "link") to make interactive Text reachable by keyboard and switch access users',
        'warning',
      ),
    );
  } else if (!roleAttr) {
    issues.push(
      makeIssue(
        'info-relationships',
        node,
        'Interactive Text is missing accessibilityRole',
        'Add accessibilityRole="button" or "link" to interactive Text so assistive technologies announce its purpose',
        'warning',
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Inline color contrast checker (1.4.3 + 1.4.11)
// ---------------------------------------------------------------------------

/** Regex that matches a 3 or 6 digit hex color string literal */
const HEX_RE = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

function isHex(value: string): boolean {
  return HEX_RE.test(value);
}

function safeContrastRatio(fg: string, bg: string): number | null {
  try {
    return wcagContrast.hex(Color(fg).hex(), Color(bg).hex());
  } catch {
    return null;
  }
}

/**
 * Extract a string literal value from an ObjectExpression property by key name.
 * Returns null if the property is absent or not a string literal.
 */
function getStylePropString(
  obj: TSESTree.ObjectExpression,
  key: string,
): string | null {
  for (const prop of obj.properties) {
    if (prop.type !== 'Property') continue;
    const p = prop as TSESTree.Property;
    const k =
      p.key.type === 'Identifier'
        ? (p.key as TSESTree.Identifier).name
        : p.key.type === 'Literal'
        ? String((p.key as TSESTree.Literal).value)
        : null;
    if (k !== key) continue;
    if (
      p.value.type === 'Literal' &&
      typeof (p.value as TSESTree.Literal).value === 'string'
    ) {
      return (p.value as TSESTree.Literal).value as string;
    }
  }
  return null;
}

/**
 * Walk an inline style JSXExpressionContainer and return the ObjectExpression
 * if the style is a plain object literal (not a StyleSheet ref or array).
 */
function getInlineStyleObject(
  attr: TSESTree.JSXAttribute | undefined,
): TSESTree.ObjectExpression | null {
  if (!attr?.value) return null;
  const { value } = attr;
  if (value.type !== 'JSXExpressionContainer') return null;
  const expr = value.expression;
  if (expr.type === 'ObjectExpression')
    return expr as TSESTree.ObjectExpression;
  return null;
}

interface InlineColorIssue {
  ruleId: 'contrast-minimum' | 'non-text-contrast';
  line: number;
  column: number;
  message: string;
  suggestion: string;
  severity: 'error' | 'warning';
}

/**
 * 1.4.3 / 1.4.11 — Inline color contrast
 *
 * Scans every JSXOpeningElement in the file for inline style objects that
 * contain literal hex color values. Checks:
 *
 *   Text / TextInput — color vs backgroundColor (1.4.3, threshold 4.5:1)
 *   View / Pressable / TouchableOpacity etc — borderColor vs backgroundColor (1.4.11, threshold 3:1)
 *
 * When backgroundColor is absent from the element itself, falls back to a
 * set of background hex values collected from all View-like containers in
 * the same file (best-effort heuristic).
 */
function checkInlineColorContrast(ast: TSESTree.Program): InlineColorIssue[] {
  const issues: InlineColorIssue[] = [];

  // ── Pass 1: collect all backgroundColor hex values used in the file ────────
  // Used as fallback backgrounds when a Text has no explicit backgroundColor.
  const fileBackgrounds = new Set<string>();

  traverseAST(ast, {
    JSXOpeningElement(node: unknown) {
      const el = node as TSESTree.JSXOpeningElement;
      const styleObj = getInlineStyleObject(getJSXAttr(el, 'style'));
      if (!styleObj) return;
      const bg = getStylePropString(styleObj, 'backgroundColor');
      if (bg && isHex(bg)) fileBackgrounds.add(bg);
    },
  });

  // Always include white and common light/dark backgrounds as implicit fallbacks
  const IMPLICIT_BACKGROUNDS = [
    '#FFFFFF',
    '#F8FAFC',
    '#F1F5F9',
    '#0F172A',
    '#1E293B',
  ];
  for (const b of IMPLICIT_BACKGROUNDS) fileBackgrounds.add(b);

  // ── Pass 2: check each element ─────────────────────────────────────────────
  const TEXT_COMPONENTS = new Set(['Text', 'TextInput']);
  const UI_COMPONENTS = new Set([
    'View',
    'Pressable',
    'TouchableOpacity',
    'TouchableHighlight',
    'TouchableWithoutFeedback',
    'TextInput',
  ]);

  traverseAST(ast, {
    JSXOpeningElement(node: unknown) {
      const el = node as TSESTree.JSXOpeningElement;
      const name = getComponentName(el);
      const styleObj = getInlineStyleObject(getJSXAttr(el, 'style'));
      if (!styleObj) return;

      const { line, column } = el.loc.start;

      // ── Text contrast (1.4.3) ──────────────────────────────────────────────
      if (TEXT_COMPONENTS.has(name)) {
        const fg = getStylePropString(styleObj, 'color');
        if (!fg || !isHex(fg)) return;

        const explicitBg = getStylePropString(styleObj, 'backgroundColor');
        const backgrounds =
          explicitBg && isHex(explicitBg) ? [explicitBg] : [...fileBackgrounds];

        // Report the worst (lowest) contrast found against any background
        let worstRatio: number | null = null;
        let worstBg = '';

        for (const bg of backgrounds) {
          const r = safeContrastRatio(fg, bg);
          if (r === null) continue;
          if (worstRatio === null || r < worstRatio) {
            worstRatio = r;
            worstBg = bg;
          }
        }

        if (worstRatio !== null && worstRatio < 4.5) {
          issues.push({
            ruleId: 'contrast-minimum',
            line,
            column,
            severity: 'error',
            message: `Inline text color ${fg} on background ${worstBg} has contrast ratio ${worstRatio.toFixed(
              2,
            )}:1 (required 4.5:1 for normal text)`,
            suggestion: `Replace ${fg} with a darker color, or lighten the background ${worstBg}, to meet WCAG 1.4.3 AA contrast`,
          });
        }
      }

      // ── Non-text contrast: borderColor (1.4.11) ────────────────────────────
      if (UI_COMPONENTS.has(name)) {
        const borderColor = getStylePropString(styleObj, 'borderColor');
        if (!borderColor || !isHex(borderColor)) return;

        const explicitBg = getStylePropString(styleObj, 'backgroundColor');
        const backgrounds =
          explicitBg && isHex(explicitBg) ? [explicitBg] : [...fileBackgrounds];

        let worstRatio: number | null = null;
        let worstBg = '';

        for (const bg of backgrounds) {
          const r = safeContrastRatio(borderColor, bg);
          if (r === null) continue;
          if (worstRatio === null || r < worstRatio) {
            worstRatio = r;
            worstBg = bg;
          }
        }

        if (worstRatio !== null && worstRatio < 3.0) {
          issues.push({
            ruleId: 'non-text-contrast',
            line,
            column,
            severity: 'warning',
            message: `Inline borderColor ${borderColor} on background ${worstBg} has contrast ratio ${worstRatio.toFixed(
              2,
            )}:1 (required 3:1 for UI components)`,
            suggestion: `Replace borderColor ${borderColor} with a color that achieves at least 3:1 contrast against ${worstBg} to meet WCAG 1.4.11`,
          });
        }
      }
    },
  });

  return issues;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function checkFile(filePath: string): AuditIssue[] {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Quick JSX guard — only process files that look like JSX
  const isTSX = filePath.endsWith('.tsx');
  const hasReact = content.includes('React');
  const hasAngleBracket = content.includes('<');

  if (!hasAngleBracket || (!isTSX && !hasReact)) {
    return [];
  }

  let ast: TSESTree.Program;

  try {
    ast = parser.parse(content, {
      jsx: true,
      useJSXTextNodes: true,
      errorOnUnknownASTType: false,
      range: true,
      loc: true,
    });
  } catch {
    // Not valid JSX or parse error — skip silently
    return [];
  }

  const issues: AuditIssue[] = [];

  traverseAST(ast, {
    JSXOpeningElement(node: unknown) {
      const jsxNode = node as TSESTree.JSXOpeningElement;
      // 1.1.1 — Non-text content (Image, Icon, SvgXml, FastImage, ImageBackground, ActivityIndicator)
      checkNonTextContent(jsxNode, issues);
      // 1.3.1 — Info & Relationships (Touchables, Switch, FlatList, ScrollView, interactive Text)
      checkInfoRelationships(jsxNode, issues);
      checkSwitch(jsxNode, issues);
      checkFlatList(jsxNode, issues);
      checkScrollView(jsxNode, issues);
      checkInteractiveText(jsxNode, issues);
      // 1.4.4 — Resize Text (Text allowFontScaling / maxFontSizeMultiplier)
      checkResizeText(jsxNode, issues);
      // 2.1.1 — Keyboard / Switch Access (View with onPress, Text with onPress)
      checkKeyboard(jsxNode, issues);
      // 2.4.3 — Focus Order (Modal)
      checkFocusOrder(jsxNode, issues);
      // 2.5.3 — Label in Name (empty accessibilityLabel on touchables)
      checkLabelInName(jsxNode, issues);
      // 2.5.8 — Target Size (inline style width/height < 24pt)
      checkTargetSize(jsxNode, issues);
      // 3.3.2 — Labels / Instructions (TextInput, Switch)
      checkLabelsInstructions(jsxNode, issues);
    },
  });

  // 1.4.3 / 1.4.11 — Inline color contrast (hex literals in style props)
  const colorIssues = checkInlineColorContrast(ast);
  for (const ci of colorIssues) {
    issues.push({
      ruleId: ci.ruleId,
      criterion: WCAG_CRITERIA[ci.ruleId],
      severity: ci.severity,
      filePath,
      line: ci.line,
      column: ci.column,
      message: ci.message,
      suggestion: ci.suggestion,
    });
  }

  // Stamp the resolved filePath on every structural issue
  for (const issue of issues) {
    if (!issue.filePath) issue.filePath = filePath;
  }

  return issues;
}
