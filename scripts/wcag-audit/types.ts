// ---------------------------------------------------------------------------
// WCAG 2.2 Audit Tool — Shared Types
// ---------------------------------------------------------------------------

export type WCAGLevel = 'A' | 'AA' | 'AAA';

export enum WCAGPrinciple {
  PERCEIVABLE = 'Perceivable',
  OPERABLE = 'Operable',
  UNDERSTANDABLE = 'Understandable',
  ROBUST = 'Robust',
}

// Severity as a string union (not enum) for easy JSON serialization
export type IssueSeverity = 'error' | 'warning' | 'info';

export interface WCAGCriterion {
  /** WCAG success criterion number, e.g. "1.4.3" */
  id: string;
  /** Conformance level */
  level: WCAGLevel;
  /** One of the four WCAG principles */
  principle: WCAGPrinciple;
  /** Human-readable title */
  title: string;
  /** Relative scoring weight used when computing the audit score */
  weight: number;
}

export interface AuditIssue {
  ruleId: string;
  criterion: WCAGCriterion;
  severity: IssueSeverity;
  /** File path where the issue was found */
  filePath: string;
  /** 1-based line number */
  line?: number;
  /** 0-based column number */
  column?: number;
  /** Human-readable description of the problem */
  message: string;
  /** Actionable fix suggestion */
  suggestion: string;
}

// ---------------------------------------------------------------------------
// Per-criterion aggregated result
// ---------------------------------------------------------------------------

export interface CriterionResult {
  id: string;
  level: WCAGLevel;
  title: string;
  principle: WCAGPrinciple;
  weight: number;
  issueCount: number;
  /** 0–100 score for this criterion */
  score: number;
  issues: AuditIssue[];
}

// ---------------------------------------------------------------------------
// Per-principle aggregated result
// ---------------------------------------------------------------------------

export interface PrincipleResult {
  name: WCAGPrinciple;
  /** Weighted average score across criteria in this principle */
  score: number;
  issueCount: number;
  criteria: CriterionResult[];
}

// ---------------------------------------------------------------------------
// Top-level audit report
// ---------------------------------------------------------------------------

export interface AuditReport {
  generatedAt: string;
  srcDir: string;
  filesScanned: number;
  totalIssues: number;
  /** Weighted overall score 0–100 */
  overallScore: number;
  principles: PrincipleResult[];
  criteria: CriterionResult[];
  issues: AuditIssue[];
}
