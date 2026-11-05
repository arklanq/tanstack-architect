// Runs each PRD in a temporary project through Claude Code and checks the "Recommended" table.
// Usage: node evals/run.mjs [--model <model>].

import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cases = JSON.parse(readFileSync(join(root, 'evals/cases.json'), 'utf8'));
const modelFlag = process.argv.indexOf('--model');
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
    const child = spawn('claude', args, { cwd, stdio: ['ignore', 'pipe', 'inherit'] });
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.on('close', () => resolve(stdout));
  });
}

function recommendedLibraries(report) {
  const section = report.split(/^## +Recommended\s*$/m)[1]?.split(/^#{1,2} /m)[0] ?? '';
  return section
    .split('\n')
    .filter((line) => line.startsWith('|') && !/^\|\s*(-|Requirement)/.test(line))
    .map((line) => line.split('|')[2]?.trim() ?? '');
}

function check(testCase, stream) {
  const events = stream.split('\n').filter(Boolean).flatMap((line) => {
    try { return [JSON.parse(line)]; } catch { return []; }
  });
  const report = events.findLast((event) => event.type === 'result')?.result ?? '';
  const usedSkill = events.some((event) => event.message?.content?.some?.((part) =>
    part.type === 'tool_use' && part.name === 'Skill' && part.input?.skill?.includes('tanstack-selection')));
  const libraries = recommendedLibraries(report);
  const has = (name) => libraries.some((cell) => new RegExp(`\\b${name}\\b`, 'i').test(cell));
  const problems = [
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
