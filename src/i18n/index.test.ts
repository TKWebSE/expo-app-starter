import { describe, expect, it } from 'vitest';
import { t } from './index';

describe('i18n', () => {
  it('V1の日本語リソースから文言を返す', () => {
    expect(t('home')).toBe('ホーム');
  });
});
