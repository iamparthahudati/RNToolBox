#!/usr/bin/env ts-node
// ---------------------------------------------------------------------------
// WCAG 2.2 Accessibility Audit — CLI Entry Point
// Usage:
//   npx ts-node --project tsconfig.scripts.json scripts/wcag-audit/index.ts
//   npx ts-node --project tsconfig.scripts.json scripts/wcag-audit/index.ts --output=json
// ---------------------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';
import { checkFile } from './ast-checker';
import { checkColorContrast } from './color-checker';
import { printReport, saveJsonReport } from './reporter';
import { TOTAL_WEIGHT, WCAG_CRITERIA } from './rules';
import {
  AuditIssue,
  AuditReport,
  CriterionResult,
  PrincipleResult,
  WCAGPrinciple,
} from './types';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SRC_DIR = path.resolve(__dirname, '../../src');
const OUTPUT_DIR = path.resolve(__dirname, '../../wcag-reports');
const OUTPUT_JSON = process.argv.includes('--output=json');

// ---------------------------------------------------------------------------
// File discovery — recursive walk, no glob dependency
// ---------------------------------------------------------------------------

function walkDir(dir: string, exts: string[]): string[] {
  const results: string[] = [];

  function walk(current: string): void {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        // Skip node_modules and hidden dirs
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
          continue;
        }
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (exts.includes(ext)) {
          results.push(fullPath);
        }
      }
    }
  }

  walk(dir);
  return results;
}

// ---------------------------------------------------------------------------
// Score calculation
// ---------------------------------------------------------------------------

/**
 * For a given criterion, compute a 0–100 score.
 * Each issue reduces the score proportionally — capped at 0.
 * Formula: max(0, 100 - issueCount * 20) — 5 issues = 0 score.
 */
function criterionScore(issueCount: number): number {
  return Math.max(0, 100 - issueCount * 20);
}

/**
 * Weighted average score across a set of criteria.
 */
function weightedScore(criteria: CriterionResult[]): number {
  if (criteria.length === 0) return 100;
  const totalWeight = criteria.reduce((s, c) => s + c.weight, 0);
  const weightedSum = criteria.reduce((s, c) => s + c.score * c.weight, 0);
  return totalWeight === 0 ? 100 : weightedSum / totalWeight;
}

// ---------------------------------------------------------------------------
// Aggregation
// ---------------------------------------------------------------------------

function buildReport(
  allIssues: AuditIssue[],
  filesScanned: number,
  srcDir: string,
): AuditReport {
  // Group issues by ruleId
  const issuesByRule = new Map<string, AuditIssue[]>();
  for (const issue of allIssues) {
    const list = issuesByRule.get(issue.ruleId) ?? [];
    list.push(issue);
    issuesByRule.set(issue.ruleId, list);
  }

  // Build per-criterion results
  const criteriaResults: CriterionResult[] = Object.entries(WCAG_CRITERIA).map(
    ([ruleId, criterion]) => {
      const issues = issuesByRule.get(ruleId) ?? [];
      return {
        id: criterion.id,
        level: criterion.level,
        title: criterion.title,
        principle: criterion.principle,
        weight: criterion.weight,
        issueCount: issues.length,
        score: criterionScore(issues.length),
        issues,
      };
    },
  );

  // Build per-principle results
  const principleOrder: WCAGPrinciple[] = [
    WCAGPrinciple.PERCEIVABLE,
    WCAGPrinciple.OPERABLE,
    WCAGPrinciple.UNDERSTANDABLE,
    WCAGPrinciple.ROBUST,
  ];

  const principleResults: PrincipleResult[] = principleOrder.map(principle => {
    const criteria = criteriaResults.filter(c => c.principle === principle);
    return {
      name: principle,
      score: weightedScore(criteria),
      issueCount: criteria.reduce((s, c) => s + c.issueCount, 0),
      criteria,
    };
  });

  // Overall weighted score across all criteria
  const overallScore =
    TOTAL_WEIGHT === 0
      ? 100
      : criteriaResults.reduce((s, c) => s + c.score * c.weight, 0) /
        TOTAL_WEIGHT;

  return {
    generatedAt: new Date().toISOString(),
    srcDir,
    filesScanned,
    totalIssues: allIssues.length,
    overallScore: Math.round(overallScore * 10) / 10,
    principles: principleResults,
    criteria: criteriaResults,
    issues: allIssues,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  // Verify src dir exists
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`Source directory not found: ${SRC_DIR}`);
    process.exit(1);
  }

  // Discover all .ts and .tsx files
  const files = walkDir(SRC_DIR, ['.ts', '.tsx']);

  const allIssues: AuditIssue[] = [];

  // AST-based checks on each file
  for (const file of files) {
    const issues = checkFile(file);
    allIssues.push(...issues);
  }

  // Color contrast checks (static, not per-file)
  const colorIssues = checkColorContrast(SRC_DIR);
  allIssues.push(...colorIssues);

  // Build the report
  const report = buildReport(allIssues, files.length, SRC_DIR);

  // Print to console
  const jsonOutputPath = OUTPUT_JSON
    ? path.join(OUTPUT_DIR, `wcag-report-${Date.now()}.json`)
    : undefined;

  printReport(report, jsonOutputPath);

  // Optionally save JSON
  if (OUTPUT_JSON && jsonOutputPath) {
    saveJsonReport(report, jsonOutputPath);
  }

  // Exit with non-zero code if there are errors (for CI)
  const hasErrors = allIssues.some(i => i.severity === 'error');
  process.exit(hasErrors ? 1 : 0);
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
