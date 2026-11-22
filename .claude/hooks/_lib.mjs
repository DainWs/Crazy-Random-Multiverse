// Shared helpers of the hooks. Node only, without dependencies and without network.
// Hook contract of Claude Code: the event arrives as JSON on stdin; exit 0 allows, exit 2 blocks and stderr reaches Claude.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

export function readHookInput(hook) {
  let raw;
  try {
    raw = readFileSync(0, 'utf8');
  } catch {
    return null;
  }
  if (!raw.trim()) return null;
  try {
    return JSON.parse(raw);
  } catch {
    // A silent guard is worse than a warning: if the contract of the hooks changes, it must show.
    process.stderr.write(`[${hook}] warning: the input is not the expected JSON; nothing was checked.\n`);
    return null;
  }
}

export function deny(hook, lines) {
  process.stderr.write(`[${hook}] BLOCKED\n${lines.join('\n')}\n`);
  process.exit(2);
}

export function targetPath(input) {
  const toolInput = input?.tool_input ?? {};
  return toolInput.file_path ?? toolInput.path ?? toolInput.notebook_path ?? '';
}

export function repoRoot(cwd = process.cwd()) {
  try {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return process.env.CLAUDE_PROJECT_DIR ?? cwd;
  }
}

// Path relative to the root of the repository, with forward slashes; empty when the file is outside it.
export function repoPath(input, path) {
  const root = repoRoot(input?.cwd ?? process.cwd()).replace(/\\/g, '/').replace(/\/$/, '');
  const file = path.replace(/\\/g, '/');
  if (file.toLowerCase().startsWith(root.toLowerCase() + '/')) return file.slice(root.length + 1);
  return /^([A-Za-z]:)?\//.test(file) ? '' : file.replace(/^\.\//, '');
}

const WRAPPERS = new Set([
  'sudo', 'env', 'command', 'exec', 'time', 'nohup', 'xargs', 'npx', 'then', 'do', 'else',
  '&', '.', 'start-process', 'invoke-expression', 'iex',
  'bash', 'sh', 'cmd', 'powershell', 'pwsh', 'wsl',
]);

// Splits a command into simple segments (by ;, &&, ||, |, newlines, $( and `) and returns the words of each one,
// without environment assignments, wrappers (sudo, bash -c, Start-Process…) and their options.
// It is not a full shell parser: when in doubt, it prefers a false positive to letting something through.
export function commandSegments(command) {
  return command
    .split(/\|\||&&|[;|\n]|\$\(|`|\(|\)|\{|\}/)
    .map((segment) =>
      segment
        .trim()
        .split(/\s+/)
        .map((word) => word.replace(/^['"]+|['"]+$/g, ''))
        .filter(Boolean),
    )
    .map((words) => {
      let i = 0;
      let wrapped = false;
      while (i < words.length) {
        const word = words[i];
        const name = programName(word);
        if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(word) || WRAPPERS.has(name)) wrapped = true;
        else if (!(wrapped && /^(-|\/c$)/i.test(word))) break;
        i++;
      }
      return words.slice(i);
    })
    .filter((words) => words.length > 0);
}

export function programName(word) {
  return word
    .split(/[\\/]/)
    .pop()
    .replace(/\.(exe|cmd|bat|ps1)$/i, '')
    .toLowerCase();
}

// Subcommand of git and its arguments, skipping the global options (git -C dir push → ['push']).
export function gitArgs(words) {
  if (programName(words[0]) !== 'git') return null;
  const WITH_VALUE = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace', '--exec-path']);
  let i = 1;
  while (i < words.length && words[i].startsWith('-')) i += WITH_VALUE.has(words[i]) ? 2 : 1;
  return words.slice(i);
}

// Local configuration with credentials, outside the repository (docs/constitution.md, section 8).
export function isLocalSecret(name) {
  const lower = name.toLowerCase();
  return (/^\.env(\..+)?$/.test(lower) && lower !== '.env.example') || /(^|[.-])local\.properties$/.test(lower);
}
