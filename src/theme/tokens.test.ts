import { describe, expect, it } from 'vitest';

import { colors, darkColors } from './tokens';

describe('theme colors', () => {
  it('ライトとダークで背景・表面・文字色を切り替える', () => {
    expect(darkColors.background).not.toBe(colors.background);
    expect(darkColors.surface).not.toBe(colors.surface);
    expect(darkColors.text).not.toBe(colors.text);
  });

  it('両テーマが同じトークンを提供する', () => {
    expect(Object.keys(darkColors).sort()).toEqual(Object.keys(colors).sort());
  });
});
