// Hook conventions-loaded (PreToolUse Edit|Write|MultiEdit|NotebookEdit). A skill is only loaded when the model decides to:
// this hook blocks a change to backend/ or frontend/ until the session has loaded the skill of that application,
// and a change to a test until it has also read the tests file of the skill (CLAUDE.md, "Reference documentation").
import { readFileSync } from 'node:fs';
import { deny, readHookInput, repoPath, targetPath } from './_lib.mjs';

const HOOK = 'conventions-loaded';
const APPS = {
  backend: { skill: 'backend-conventions', tests: 'backend-tests.md', testFolder: /^backend\/src\/test\// },
  frontend: { skill: 'frontend-conventions', tests: 'frontend-tests.md', testFolder: /^frontend\/(test|e2e)\// },
};
const BUILD_OUTPUT = /\/(node_modules|target|dist|test-results|playwright-report)\//;

const input = readHookInput(HOOK);
const path = repoPath(input, targetPath(input));
const app = APPS[path.split('/')[0]];
if (!app || BUILD_OUTPUT.test('/' + path)) process.exit(0);

let transcript;
try {
  // The transcript is JSON: a Windows path appears in it with its backslashes escaped.
  transcript = readFileSync(input.transcript_path, 'utf8').replaceAll('\\\\', '/');
} catch {
  process.stderr.write(`[${HOOK}] warning: the transcript cannot be read; the load of ${app.skill} was not checked.\n`);
  process.exit(0);
}

const folder = `\\.claude/skills/${app.skill}/`;
const skillLoaded =
  new RegExp(`"skill"\\s*:\\s*"${app.skill}"`).test(transcript) ||
  transcript.includes(`<command-name>/${app.skill}</command-name>`) ||
  new RegExp(`"file_path"\\s*:\\s*"[^"]*${folder}SKILL\\.md"`).test(transcript);
const testsRead = new RegExp(`"file_path"\\s*:\\s*"[^"]*${folder}${app.tests.replace('.', '\\.')}"`).test(transcript);
const isTest = app.testFolder.test(path);

const missing = [];
if (!skillLoaded) missing.push(`load the skill \`${app.skill}\` with the Skill tool`);
if (isTest && !testsRead) missing.push(`read \`.claude/skills/${app.skill}/${app.tests}\``);
if (missing.length > 0) {
  deny(HOOK, [
    `File: ${path}`,
    `Reason: the conventions of ${path.split('/')[0]}/ are mandatory before changing its code or its tests, and this session has not loaded them.`,
    `What to do: ${missing.join(' and ')}, then repeat the change.`,
  ]);
}
process.exit(0);
