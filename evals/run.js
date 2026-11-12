// Runs each case in a temporary project through Claude Code and checks the "Recommended" and "Migration" tables.
// Usage: node evals/run.js [--model <model>].

import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cases = JSON.parse(readFileSync(join(root, 'evals/cases.json'), 'utf8'));
const modelFlag = process.argv.indexOf('--model');
if (modelFlag > -1 && !process.argv[modelFlag + 1]) {
  throw new Error('--model needs a value.');
}
const model = modelFlag > -1 ? ['--model', process.argv[modelFlag + 1]] : [];
const outputDir = mkdtempSync(join(tmpdir(), 'tanstack-architect-evals-'));

function runClaude(testCase) {
  const cwd = mkdtempSync(join(tmpdir(), `eval-${testCase.id}-`));
  if (testCase.packageJson) {
    writeFileSync(join(cwd, 'package.json'), JSON.stringify(testCase.packageJson, null, 2));
  }
  const args = [
    '-p', testCase.prompt,
    '--plugin-dir', root,
    '--setting-sources', 'project',
    '--output-format', 'stream-json',
    '--verbose',
    '--allowedTools', 'Read,Glob,Grep,Bash,WebFetch,Skill,Agent',
    ...model,
  ];
  return new Promise((resolve) => {
    let stdout = '';
    const child = spawn('claude', args, { cwd, stdio: ['ignore', 'pipe', 'inherit'], timeout: 15 * 60 * 1000 });
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.on('close', (exitCode) => resolve({ stream: stdout, exitCode }));
  });
}

function tableRows(report, heading) {
  const section = report.split(new RegExp(`^## +${heading}\\s*$`, 'm'))[1]?.split(/^#{1,2} /m)[0] ?? '';
  return section
    .split('\n')
    .filter((line) => line.startsWith('|') && !/^\|\s*(:?-|Requirement|Concern)/.test(line))
    .map((line) => line.split('|').map((cell) => cell.trim()));
}

// Libraries the report proposes: new ones under Recommended, and replacements under Migration that it does not keep.
function recommendedLibraries(report) {
  const recommended = tableRows(report, 'Recommended').map((cells) => cells[2] ?? '');
  const migrated = tableRows(report, 'Migration')
    .filter((cells) => !/^\W*keep\b/i.test(cells[6] ?? ''))
    .map((cells) => cells[3] ?? '');
  return [...recommended, ...migrated];
}

function check(testCase, { stream, exitCode }) {
  const events = stream.split('\n').filter(Boolean).flatMap((line) => {
    try { return [JSON.parse(line)]; } catch { return []; }
  });
  const report = events.findLast((event) => event.type === 'result')?.result ?? '';
  const usedSkill = events.some((event) => event.message?.content?.some?.((part) =>
    part.type === 'tool_use' && part.name === 'Skill' && part.input?.skill?.includes('tanstack-selection')));
  const libraries = recommendedLibraries(report);
  const has = (name) => libraries.some((cell) => new RegExp(`\\b${name}\\b`, 'i').test(cell));
  const problems = [
    ...(exitCode === 0 ? [] : [`claude exit code: ${exitCode}`]),
    ...(report.trim() ? [] : ['empty report']),
    ...(usedSkill || testCase.skillOptional ? [] : ['the skill was not used']),
    ...(/^## +Stack\s*$/m.test(report) || testCase.skillOptional ? [] : ['no report format']),
    ...testCase.forbidden.filter(has).map((name) => `forbidden: ${name}`),
    ...(testCase.required ?? []).filter((name) => !has(name)).map((name) => `missing: ${name}`),
  ];
  writeFileSync(join(outputDir, `${testCase.id}.md`), report);
  writeFileSync(join(outputDir, `${testCase.id}.jsonl`), stream);
  return { id: testCase.id, libraries, problems };
}

const results = await Promise.all(cases.map(async (testCase) => check(testCase, await runClaude(testCase))));
for (const { id, libraries, problems } of results) {
  console.log(`${problems.length ? 'FAIL' : 'PASS'} ${id}: [${libraries.join(', ')}] ${problems.join('; ')}`);
}
console.log(`Reports: ${outputDir}.`);
process.exitCode = results.some(({ problems }) => problems.length) ? 1 : 0;
