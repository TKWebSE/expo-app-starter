import { describe, expect, it } from 'vitest';

import { displayNameSchema } from './profileSchema';

describe('displayNameSchema', () => {
  it('前後の空白を除いて1文字なら受理する', () => {
    expect(displayNameSchema.parse('  A  ')).toBe('A');
  });

  it('50文字を受理し51文字以上を拒否する', () => {
    expect(displayNameSchema.safeParse('a'.repeat(50)).success).toBe(true);
    expect(displayNameSchema.safeParse('a'.repeat(51)).success).toBe(false);
  });

  it('空文字と空白だけを拒否する', () => {
    expect(displayNameSchema.safeParse('').success).toBe(false);
    expect(displayNameSchema.safeParse('   ').success).toBe(false);
  });

  it.each(['御主人様', 'User_01!', '🌸'])('%s を受理する', (displayName) => {
    expect(displayNameSchema.safeParse(displayName).success).toBe(true);
  });
});
