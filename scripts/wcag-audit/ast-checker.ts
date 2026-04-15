import { TSESTree } from '@typescript-eslint/types';
import { WCAG_CRITERIA } from './rules';
import { AuditIssue } from './types';

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const parser = require('@typescript-eslint/parser') as {
  parse(code: string, options: Record<string, unknown>): TSESTree.Program;
};
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs: { readFileSync(path: string, enc: 'utf-8'): string } = require('fs');

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

const IMAGE_COMPONENTS = new Set(['Image', 'Icon', 'SvgXml', 'FastImage']);

const TOUCHABLE_COMPONENTS = new Set([
  'TouchableOpacity',
  'Pressable',
  'TouchableHighlight',
  'TouchableWithoutFeedback',
]);

const TOUCHABLE_LABEL_COMPONENTS = new Set([
  'TouchableOpacity',
  'Pressable',
  'TouchableHighlight',
]);

const TOUCHABLE_SIZE_COMPONENTS = new Set([
  'TouchableOpacity',
  'Pressable',
  'TouchableHighlight',
]);

// ---------------------------------------------------------------------------
// Rule implementations
// ---------------------------------------------------------------------------

/**
 * 1.1.1 — Non-text Content
 * Image/Icon/SvgXml/FastImage must have a non-empty accessibilityLabel.
 */
function checkNonTextContent(
  node: TSESTree.JSXOpeningElement,
  issues: AuditIssue[],
): void {
  const name = getComponentName(node);
  if (!IMAGE_COMPONENTS.has(name)) return;

  const attr = getJSXAttr(node, 'accessibilityLabel');
  const missing = !attr;
  const empty = attr
    ? (getAttrStringValue(attr) ?? '').trim() === '' &&
      getAttrStringValue(attr) !== null
    : false;

  if (missing || empty) {
    issues.push(
      makeIssue(
        'non-text-content',
        node,
        `${name} is missing accessibilityLabel`,
        'Add accessibilityLabel="description of image" to convey meaning to screen reader users',
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
      checkNonTextContent(jsxNode, issues);
      checkInfoRelationships(jsxNode, issues);
      checkResizeText(jsxNode, issues);
      checkKeyboard(jsxNode, issues);
      checkFocusOrder(jsxNode, issues);
      checkLabelInName(jsxNode, issues);
      checkTargetSize(jsxNode, issues);
      checkLabelsInstructions(jsxNode, issues);
    },
  });

  // Stamp the resolved filePath on every issue (makeIssue leaves it blank)
  for (const issue of issues) {
    issue.filePath = filePath;
  }

  return issues;
}
