import { describe, expect, it } from 'vitest';

import { SNACKBAR_DURATION_MS, snackbarColor } from './snackbar';

describe('snackbar', () => {
  it('通常は約4秒後に閉じる設定とする', () => {
    expect(SNACKBAR_DURATION_MS).toBe(4_000);
  });

  it('通知種別ごとの色を返す', () => {
    expect(snackbarColor('success')).toBe('#15803D');
    expect(snackbarColor('error')).toBe('#B91C1C');
    expect(snackbarColor('info')).toBe('#0369A1');
    expect(snackbarColor('warning')).toBe('#A16207');
  });
});
