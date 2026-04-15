// eslint-disable-next-line @typescript-eslint/no-require-imports
const chalk = require('chalk') as typeof import('chalk');
import * as fs from 'fs';
import * as path from 'path';
import { AuditIssue, AuditReport } from './types';

// chalk.green / chalk.red etc. are both callable and have sub-properties like .bold
// Use a loose type that covers both usages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChalkFn = any;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function scoreColor(n: number): ChalkFn {
  if (n >= 80) return chalk.green;
  if (n >= 60) return chalk.yellow;
  return chalk.red;
}

function progressBar(score: number, width: number): string {
  const filled = Math.round((Math.max(0, Math.min(100, score)) / 100) * width);
  const empty = width - filled;
  return scoreColor(score)('█'.repeat(filled)) + chalk.dim('░'.repeat(empty));
}

function severityBadge(severity: AuditIssue['severity']): string {
  switch (severity) {
    case 'error':
      return chalk.red.bold('[ERROR]');
    case 'warning':
      return chalk.yellow.bold('[WARN] ');
    case 'info':
      return chalk.blue.bold('[INFO] ');
  }
}

function criterionRowColor(issueCount: number): ChalkFn {
  if (issueCount === 0) return chalk.green;
  if (issueCount <= 2) return chalk.yellow;
  return chalk.red;
}

/** ANSI-escape-aware column padding */
function pad(str: string, len: number): string {
  const plain = str.replace(/\x1B\[[0-9;]*m/g, '');
  const diff = len - plain.length;
  return diff > 0 ? str + ' '.repeat(diff) : str;
}

function divider(char = '─', width = 80): string {
  return chalk.dim(char.repeat(width));
}

// ---------------------------------------------------------------------------
// printReport
// ---------------------------------------------------------------------------

export function printReport(
  result: AuditReport,
  jsonOutputPath?: string,
): void {
  const BAR_WIDTH = 40;
  const COL_WIDTH = 80;

  // 1. Header banner
  console.log('');
  console.log(chalk.bold.blue('╔' + '═'.repeat(COL_WIDTH - 2) + '╗'));
  const title = 'WCAG 2.2 Accessibility Audit Report';
  const titlePad = Math.floor((COL_WIDTH - 2 - title.length) / 2);
  console.log(
    chalk.bold.blue('║') +
      ' '.repeat(titlePad) +
      chalk.bold.blue(title) +
      ' '.repeat(COL_WIDTH - 2 - titlePad - title.length) +
      chalk.bold.blue('║'),
  );
  console.log(chalk.bold.blue('╚' + '═'.repeat(COL_WIDTH - 2) + '╝'));
  console.log('');

  // 2. Metadata
  console.log(chalk.dim('Source dir    : ') + chalk.white(result.srcDir));
  console.log(chalk.dim('Files scanned : ') + chalk.white(result.filesScanned));
  console.log(chalk.dim('Total issues  : ') + chalk.white(result.totalIssues));
  console.log(
    chalk.dim('Generated at  : ') +
      chalk.white(new Date(result.generatedAt).toLocaleString()),
  );
  console.log('');

  // 3. Overall score
  console.log(divider());
  console.log(chalk.bold('  OVERALL SCORE'));
  console.log(divider());
  const scoreStr = `${result.overallScore.toFixed(1)} / 100`;
  console.log('  ' + scoreColor(result.overallScore).bold(scoreStr));
  console.log('  ' + progressBar(result.overallScore, BAR_WIDTH));
  console.log('');

  // 4. Per-principle breakdown
  console.log(divider());
  console.log(chalk.bold('  PRINCIPLE BREAKDOWN'));
  console.log(divider());
  console.log(
    '  ' +
      pad(chalk.bold('Principle'), 20) +
      pad(chalk.bold('Score'), 12) +
      chalk.bold('Issues'),
  );
  console.log('  ' + chalk.dim('─'.repeat(40)));

  for (const p of result.principles) {
    console.log(
      '  ' +
        pad(chalk.white(p.name), 20) +
        pad(scoreColor(p.score)(`${p.score.toFixed(1)}`), 12) +
        chalk.white(String(p.issueCount)),
    );
  }
  console.log('');

  // 5. Per-criterion table
  console.log(divider());
  console.log(chalk.bold('  CRITERION DETAILS'));
  console.log(divider());
  console.log(
    '  ' +
      pad(chalk.bold('ID'), 10) +
      pad(chalk.bold('Level'), 8) +
      pad(chalk.bold('Title'), 36) +
      pad(chalk.bold('Score'), 10) +
      chalk.bold('Issues'),
  );
  console.log('  ' + chalk.dim('─'.repeat(72)));

  for (const c of result.criteria) {
    const color = criterionRowColor(c.issueCount);
    console.log(
      '  ' +
        pad(color(c.id), 10) +
        pad(color(c.level), 8) +
        pad(color(c.title.slice(0, 34)), 36) +
        pad(color(`${c.score.toFixed(1)}`), 10) +
        color(String(c.issueCount)),
    );
  }
  console.log('');

  // 6. Issues grouped by file
  console.log(divider());
  console.log(chalk.bold('  ISSUES'));
  console.log(divider());

  if (result.issues.length === 0) {
    console.log(chalk.green('  No issues found. Great work!'));
  } else {
    const byFile = new Map<string, AuditIssue[]>();
    for (const issue of result.issues) {
      const key = issue.filePath || '(unknown file)';
      if (!byFile.has(key)) byFile.set(key, []);
      byFile.get(key)!.push(issue);
    }

    for (const [file, issues] of byFile) {
      console.log('');
      console.log(chalk.bold.underline(file));

      for (const issue of issues) {
        const location =
          issue.line != null
            ? chalk.dim(
                `line ${issue.line}${
                  issue.column != null ? `:${issue.column}` : ''
                }`,
              )
            : chalk.dim('—');

        console.log(
          `  ${severityBadge(issue.severity)}  ` +
            chalk.cyan(`[${issue.criterion.id}]`) +
            '  ' +
            location +
            '  ' +
            chalk.white(issue.message),
        );
        console.log(chalk.dim(`         Suggestion: ${issue.suggestion}`));
      }
    }
  }
  console.log('');

  // 7. Summary footer
  console.log(divider());
  const errors = result.issues.filter(i => i.severity === 'error').length;
  const warnings = result.issues.filter(i => i.severity === 'warning').length;
  const infos = result.issues.filter(i => i.severity === 'info').length;

  console.log(
    chalk.bold('  SUMMARY  ') +
      chalk.red.bold(`${errors} error${errors !== 1 ? 's' : ''}`) +
      chalk.dim('  |  ') +
      chalk.yellow.bold(`${warnings} warning${warnings !== 1 ? 's' : ''}`) +
      chalk.dim('  |  ') +
      chalk.blue.bold(`${infos} info`),
  );
  console.log(divider());
  console.log('');

  if (jsonOutputPath) {
    console.log(
      chalk.dim('JSON report saved to: ') + chalk.white(jsonOutputPath),
    );
    console.log('');
  }
}

// ---------------------------------------------------------------------------
// saveJsonReport
// ---------------------------------------------------------------------------

export function saveJsonReport(result: AuditReport, outputPath: string): void {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
}
