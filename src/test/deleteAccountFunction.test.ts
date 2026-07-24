import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'supabase/functions/delete-account/index.ts'),
  'utf8',
);

describe('delete-account Edge Function contract', () => {
  it('呼出ユーザーを検証して管理APIで同じIDを削除する', () => {
    expect(source).toContain('userClient.auth.getUser()');
    expect(source).toContain('admin.auth.admin.deleteUser(user.id)');
  });

  it('Service Role Keyを環境変数からだけ取得する', () => {
    expect(source).toContain("Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')");
    expect(source).not.toMatch(/service_role.*eyJ/i);
  });
});
