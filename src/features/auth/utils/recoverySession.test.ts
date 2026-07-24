import { describe, expect, it } from 'vitest';
import { recoveryTokensFromUrl } from './recoverySession';

describe('recoveryTokensFromUrl', () => {
  it('パスワード再設定リンクからセッショントークンを取得する', () => {
    expect(
      recoveryTokensFromUrl(
        'expoappstarter://new-password#access_token=a&refresh_token=r&type=recovery',
      ),
    ).toEqual({ accessToken: 'a', refreshToken: 'r' });
  });
  it('トークンのないURLは無視する', () => {
    expect(recoveryTokensFromUrl('expoappstarter://new-password')).toBeNull();
  });
});
