import { z } from 'zod';

export const displayNameSchema = z
  .string()
  .transform((value) => value.trim())
  .pipe(
    z
      .string()
      .min(1, '表示名を入力してください')
      .max(50, '表示名は50文字以下で入力してください'),
  );

export const profileSchema = z.object({
  displayName: displayNameSchema,
});
