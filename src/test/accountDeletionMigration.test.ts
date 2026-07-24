import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const migration = readFileSync(
  resolve(
    process.cwd(),
    'supabase/migrations/202607240002_account_deletion.sql',
  ),
  'utf8',
).toLowerCase();

describe('account deletion migration contract', () => {
  it('auth.users削除時にprofilesを連動削除する', () => {
    expect(migration).toContain('references auth.users (id)');
    expect(migration).toContain('on delete cascade');
  });
});
