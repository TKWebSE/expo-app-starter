import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'パスワードは8文字以上で入力してください')
  .max(64, 'パスワードは64文字以下で入力してください')
  .refine((value) => value.trim().length > 0, {
    message: '空白だけのパスワードは使用できません',
  });

export const loginSchema = z.object({
  email: z.email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
});

export const signupSchema = z
  .object({
    email: z.email('有効なメールアドレスを入力してください'),
    password: passwordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((value) => value.password === value.passwordConfirmation, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirmation'],
  });

export const resetPasswordSchema = z.object({
  email: z.email('有効なメールアドレスを入力してください'),
});

export const newPasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((value) => value.password === value.passwordConfirmation, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirmation'],
  });
