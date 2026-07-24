import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const config = readFileSync(
  resolve(process.cwd(), 'supabase/config.toml'),
  'utf8',
);

describe('Supabase local auth config', () => {
  it('WebとAndroidの認証リダイレクトを許可する', () => {
    expect(config).toContain('http://127.0.0.1:8083/**');
    expect(config).toContain('expoappstarter://**');
  });

  it('認証メールの再送を60秒制限する', () => {
    expect(config).toContain('max_frequency = "60s"');
  });
});
