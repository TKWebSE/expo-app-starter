import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

describe('V3 UI contracts', () => {
  it('設定画面に表示名と法務ページへの導線がある', () => {
    const settings = source('src/app/settings.tsx');
    expect(settings).toContain('profileQuery.data?.displayName');
    expect(settings).toContain("'/terms'");
    expect(settings).toContain("'/privacy'");
  });

  it('新規登録画面から利用規約とプライバシーポリシーへ遷移できる', () => {
    const signup = source('src/app/signup.tsx');
    expect(signup).toContain("'/terms'");
    expect(signup).toContain("'/privacy'");
  });

  it('登録時に予期せず発行されたローカルセッションを破棄する', () => {
    const repository = source(
      'src/features/auth/repositories/SupabaseAuthRepository.ts',
    );
    expect(repository).toContain('if (data.session)');
    expect(repository).toContain("signOut({ scope: 'local' })");
  });

  it('法務ページに主要事項が記載されている', () => {
    expect(source('src/app/terms.tsx')).toContain('禁止事項');
    const privacy = source('src/app/privacy.tsx');
    expect(privacy).toContain('取得する情報');
    expect(privacy).toContain('Supabase');
  });
});
