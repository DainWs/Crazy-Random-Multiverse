// Hook precommit-checks (PreToolUse Bash|PowerShell, only on `git commit`). Before a commit with code of an application,
// it type-checks and lints the frontend files of the commit, or compiles the backend with its tests, and BLOCKS if it fails.
// The base starts green, so an error is a new error. There is no way around it: committing in red is decided by the person.
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { commandSegments, deny, gitArgs, readHookInput, repoRoot } from './_lib.mjs';

const HOOK = 'precommit-checks';
const TIMEOUT_MS = 240_000;
const OUTPUT_LINES = 30;

const input = readHookInput(HOOK);
const command = input?.tool_input?.command;
if (typeof command !== 'string') process.exit(0);

const segments = commandSegments(command).map((words) => gitArgs(words) ?? []);
if (!segments.some((args) => args[0] === 'commit')) process.exit(0);
// In PreToolUse the `git add` of the same command has not run yet.
const addsInSameCommand = segments.some((args) => args[0] === 'add');

const root = repoRoot(input?.cwd ?? process.cwd());
const git = (...args) => {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return '';
  }
};

const files = new Set(git('diff', '--cached', '--name-only', '--diff-filter=ACMR').split('\n'));
if (addsInSameCommand) {
  for (const file of git('ls-files', '--modified', '--others', '--exclude-standard').split('\n')) files.add(file);
}
const frontendFiles = [...files]
  .filter((file) => /^frontend\/.+\.(ts|vue|js|mjs)$/.test(file) && existsSync(join(root, file)))
  .map((file) => file.slice('frontend/'.length));
const backendChanged = [...files].some((file) => /^backend\/.+\.java$/.test(file));

const failures = [];
const warnings = [];

function run(name, cwd, program, args, options = {}) {
  const result = spawnSync(program, args, {
    cwd,
    encoding: 'utf8',
    timeout: TIMEOUT_MS,
    env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
    ...options,
  });
  if (result.status === 0) return;
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim().split('\n').slice(-OUTPUT_LINES).join('\n');
  failures.push(`--- ${name} ---\n${output || result.error?.message || 'no output'}`);
}

if (frontendFiles.length > 0) {
  const frontend = join(root, 'frontend');
  const vueTsc = join(frontend, 'node_modules', 'vue-tsc', 'bin', 'vue-tsc.js');
  const eslint = join(frontend, 'node_modules', 'eslint', 'bin', 'eslint.js');
  if (!existsSync(vueTsc) || !existsSync(eslint)) warnings.push('frontend: node_modules is not installed; nothing was checked (`npm install` in frontend/).');
  else {
    run('frontend typecheck (vue-tsc --noEmit)', frontend, process.execPath, [vueTsc, '--noEmit', '-p', 'tsconfig.json']);
    run('frontend lint (eslint <files of the commit>)', frontend, process.execPath, [eslint, ...frontendFiles]);
  }
}
if (backendChanged) {
  // Offline: the hook never downloads anything; a dependency that is not in the local repository shows as a failure.
  run('backend compile (mvn -q -o test-compile)', join(root, 'backend'), 'mvn', ['-q', '-o', 'test-compile'], { shell: process.platform === 'win32' });
}

for (const warning of warnings) process.stderr.write(`[${HOOK}] warning: ${warning}\n`);
if (failures.length > 0) {
  deny(HOOK, [
    'The checks fail for the code of this commit:',
    ...failures,
    'What to do: fix the errors, run the integration again (CLAUDE.md, "Workflow") and repeat the commit.',
  ]);
}
process.exit(0);
