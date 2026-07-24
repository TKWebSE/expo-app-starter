import { describe, expect, it } from 'vitest';

import { signupSchema } from './authSchemas';

const validInput = {
  email: 'user@example.com',
  password: 'abcdefgh',
  passwordConfirmation: 'abcdefgh',
};

describe('signupSchema', () => {
  it('8文字のパスワードを受理する', () => {
    expect(signupSchema.safeParse(validInput).success).toBe(true);
  });

  it('7文字以下を拒否する', () => {
    expect(
      signupSchema.safeParse({
        ...validInput,
        password: 'abcdefg',
        passwordConfirmation: 'abcdefg',
      }).success,
    ).toBe(false);
  });

  it('64文字を受理し65文字以上を拒否する', () => {
    const sixtyFourCharacters = 'a'.repeat(64);
    const sixtyFiveCharacters = 'a'.repeat(65);

    expect(
      signupSchema.safeParse({
        ...validInput,
        password: sixtyFourCharacters,
        passwordConfirmation: sixtyFourCharacters,
      }).success,
    ).toBe(true);
    expect(
      signupSchema.safeParse({
        ...validInput,
        password: sixtyFiveCharacters,
        passwordConfirmation: sixtyFiveCharacters,
      }).success,
    ).toBe(false);
  });

  it('空白だけのパスワードを拒否する', () => {
    expect(
      signupSchema.safeParse({
        ...validInput,
        password: '        ',
        passwordConfirmation: '        ',
      }).success,
    ).toBe(false);
  });

  it('文字種の組み合わせを強制しない', () => {
    expect(
      signupSchema.safeParse({
        ...validInput,
        password: 'ひらがなだけです',
        passwordConfirmation: 'ひらがなだけです',
      }).success,
    ).toBe(true);
  });

  it('確認入力との不一致を拒否する', () => {
    const result = signupSchema.safeParse({
      ...validInput,
      passwordConfirmation: 'different',
    });

    expect(result.success).toBe(false);
  });
});
