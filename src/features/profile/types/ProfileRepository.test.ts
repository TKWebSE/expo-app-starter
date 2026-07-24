import { describe, expectTypeOf, it } from 'vitest';

import type { ProfileRepository } from './ProfileRepository';

describe('ProfileRepository', () => {
  it('V1ではプロフィール削除APIを公開しない', () => {
    expectTypeOf<ProfileRepository>().not.toHaveProperty('delete');
    expectTypeOf<ProfileRepository>().not.toHaveProperty('remove');
  });
});
