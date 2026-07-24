import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const migration = readFileSync(
  resolve(
    process.cwd(),
    'supabase/migrations/202607240001_create_profiles.sql',
  ),
  'utf8',
).toLowerCase();

describe('profiles migration contract', () => {
  it('auth.users作成後にprofilesを自動作成する', () => {
    expect(migration).toContain('after insert on auth.users');
    expect(migration).toContain("split_part(coalesce(new.email, ''), '@', 1)");
  });

  it('RLSを有効にし本人の参照・追加・更新だけを許可する', () => {
    expect(migration).toContain('enable row level security');
    expect(migration).toContain('for select');
    expect(migration).toContain('for insert');
    expect(migration).toContain('for update');
    expect(migration).toContain('auth.uid()) = id');
  });

  it('V1にはDELETEポリシーを含めない', () => {
    expect(migration).not.toMatch(/for\s+delete/);
  });
});
