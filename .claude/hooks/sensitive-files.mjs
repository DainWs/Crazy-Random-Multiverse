// Hook sensitive-files (PreToolUse Edit|Write|MultiEdit|NotebookEdit). Blocks writing credentials, keys and lockfiles.
import { deny, isLocalSecret, readHookInput, targetPath } from './_lib.mjs';

const HOOK = 'sensitive-files';
const RULES = [
  {
    test: isLocalSecret,
    why: 'it is local configuration (`.env*`, `*local.properties`), which holds credentials and stays outside the repository.',
    fix: 'Credentials are written by the person (docs/constitution.md, section 8). A new variable is documented with its default in the versioned configuration.',
  },
  {
    test: (name) => /\.(pem|key|p12|pfx|ppk|jks|keystore)$/i.test(name) || /^id_(rsa|ed25519|ecdsa|dsa)(\.pub)?$/i.test(name),
    why: 'it is a key or a certificate.',
    fix: 'Keys are not written from Claude Code. If it is really needed, the person does it by hand.',
  },
  {
    test: (name) => ['package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock', 'pnpm-lock.yaml'].includes(name.toLowerCase()),
    why: 'it is a lockfile: it is regenerated, not edited by hand.',
    fix: 'Use `npm install <package>` or `npm uninstall`, after asking for the new dependency (CLAUDE.md, "Ask before doing anything if").',
  },
];

const input = readHookInput(HOOK);
const path = targetPath(input).replace(/\\/g, '/');
if (!path) process.exit(0);

const name = path.split('/').pop() ?? '';
for (const rule of RULES) {
  if (rule.test(name)) deny(HOOK, [`File: ${path}`, `Reason: ${rule.why}`, `What to do: ${rule.fix}`]);
}
process.exit(0);
