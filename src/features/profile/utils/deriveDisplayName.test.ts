import { describe, expect, it } from 'vitest';

import { deriveDisplayName } from './deriveDisplayName';

describe('deriveDisplayName', () => {
  it('メールアドレスの@より前を表示名にする', () => {
    expect(deriveDisplayName('sample.user@example.com')).toBe('sample.user');
  });

  it('50文字を超える場合は50文字に収める', () => {
    expect(deriveDisplayName(`${'a'.repeat(60)}@example.com`)).toHaveLength(50);
  });

  it('ローカル部が空なら安全な初期値を返す', () => {
    expect(deriveDisplayName('@example.com')).toBe('user');
  });
});
