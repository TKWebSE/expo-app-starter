import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .filter((file) => !file.endsWith('package-lock.json'));
const suspicious = [
  /service[_ -]?role/i,
  /SUPABASE_SERVICE_ROLE_KEY/,
  /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/,
];
const allowed = new Set([
  'README.md',
  '.env.example',
  'docs/01-requirements/README.md',
  'docs/03-internal-design/README.md',
  'scripts/check-secrets.mjs',
  'supabase/config.toml',
]);
const findings = [];

for (const file of files) {
  if (allowed.has(file)) continue;
  let content;
  try {
    content = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  if (suspicious.some((pattern) => pattern.test(content))) findings.push(file);
}

if (findings.length) {
  console.error(
    `秘密情報の可能性がある文字列を検出しました:\n${findings.join('\n')}`,
  );
  process.exit(1);
}
console.log('秘密情報の既知パターンは検出されませんでした');
