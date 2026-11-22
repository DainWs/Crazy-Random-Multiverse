// Hook no-external (PreToolUse Bash|PowerShell). Enforces "You do not run anything against real infrastructure" of CLAUDE.md:
// no SSH or SCP, no outbound network other than installing declared dependencies, no publishing and no reading of local credentials.
// It is the second net of permissions.deny in .claude/settings.json: if one rule does not match, the other one does.
import { commandSegments, deny, gitArgs, isLocalSecret, programName, readHookInput } from './_lib.mjs';

const HOOK = 'no-external';
const REMOTE_SHELL = new Set(['ssh', 'scp', 'sftp', 'rsync', 'plink', 'pscp', 'psftp', 'putty', 'telnet', 'ftp', 'nc', 'ncat', 'netcat', 'enter-pssession', 'new-pssession']);
const DOWNLOAD = new Set(['curl', 'wget', 'invoke-webrequest', 'iwr', 'invoke-restmethod', 'irm', 'start-bitstransfer']);
const GIT_NETWORK = new Set(['push', 'pull', 'fetch', 'clone', 'ls-remote']);

const input = readHookInput(HOOK);
const command = input?.tool_input?.command;
if (typeof command !== 'string' || !command.trim()) process.exit(0);

function readsLocalSecret(word) {
  return isLocalSecret(programName(word.replace(/^[0-9]*[<>]+&?/, '')));
}

function reason(words) {
  if (words.some(readsLocalSecret)) {
    return 'the command reads or writes local configuration (`.env*`, `*local.properties`), which holds credentials (docs/constitution.md, section 8).';
  }
  // A path with spaces splits the program into several words: any word that is the path of a blocked program counts.
  const executable = words.find((word) => /[\\/]|\.exe$/i.test(word) && (REMOTE_SHELL.has(programName(word)) || DOWNLOAD.has(programName(word))));
  const program = programName(executable ?? words[0]);
  if (REMOTE_SHELL.has(program)) return `\`${program}\`: SSH, SCP and remote connections to any host are forbidden.`;
  if (DOWNLOAD.has(program)) return `\`${program}\`: no outbound network. Dependencies are installed with \`npm install\` or Maven; the backend and the socket are tested with local doubles.`;
  const git = gitArgs(words);
  if (git) {
    if (GIT_NETWORK.has(git[0])) return `\`git ${git[0]}\`: talks to a remote. The person does it.`;
    if (git[0] === 'remote' && ['add', 'set-url'].includes(git[1])) return '`git remote add/set-url`: the remotes are managed by the person.';
    return null;
  }
  const sub = words.slice(1).find((word) => !word.startsWith('-'));
  if (['npm', 'pnpm', 'yarn'].includes(program) && sub === 'publish') return `\`${program} publish\`: this repository does not publish packages.`;
  if (['mvn', 'mvnw'].includes(program) && words.slice(1).includes('deploy')) return '`mvn deploy`: this repository does not publish artifacts.';
  return null;
}

for (const words of commandSegments(command)) {
  const why = reason(words);
  if (why) {
    deny(HOOK, [
      `Command: ${command}`,
      `Reason: ${why}`,
      'What to do: solve it without network, remotes or local credentials; if it is really needed, ask the person to do it.',
    ]);
  }
}
process.exit(0);
