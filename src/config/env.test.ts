import { describe, expect, it } from 'vitest';

import { parseEnv } from './env';

describe('parseEnv', () => {
  it('公開可能なSupabase設定を受理する', () => {
    expect(
      parseEnv({
        EXPO_PUBLIC_APP_ENV: 'staging',
        EXPO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        EXPO_PUBLIC_SUPABASE_ANON_KEY: 'public-anon-key',
      }),
    ).toEqual({
      EXPO_PUBLIC_APP_ENV: 'staging',
      EXPO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: 'public-anon-key',
    });
  });

  it('設定不足を起動前に拒否する', () => {
    expect(() => parseEnv({})).toThrow();
  });
});
