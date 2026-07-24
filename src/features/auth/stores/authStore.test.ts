import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  AuthRepository,
  AuthStateListener,
  AuthUser,
  SignUpInput,
} from '../types/AuthRepository';
import { createAuthStore } from './authStore';

const user: AuthUser = {
  id: 'user-1',
  email: 'user@example.com',
};

function createRepository(
  overrides: Partial<AuthRepository> = {},
): AuthRepository {
  return {
    getCurrentUser: vi.fn().mockResolvedValue(null),
    onAuthStateChange: vi.fn((_listener: AuthStateListener) => () => undefined),
    signUp: vi.fn().mockResolvedValue(user),
    signIn: vi.fn().mockResolvedValue(user),
    signOut: vi.fn().mockResolvedValue(undefined),
    sendPasswordReset: vi.fn().mockResolvedValue(undefined),
    updatePassword: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('起動時に保存済みセッションを復元する', async () => {
    const repository = createRepository({
      getCurrentUser: vi.fn().mockResolvedValue(user),
    });
    const store = createAuthStore(repository);

    await store.getState().initialize();

    expect(store.getState()).toMatchObject({
      status: 'authenticated',
      user,
      error: null,
    });
  });

  it('保存済みセッションがなければ未認証にする', async () => {
    const store = createAuthStore(createRepository());

    await store.getState().initialize();

    expect(store.getState()).toMatchObject({
      status: 'unauthenticated',
      user: null,
    });
  });

  it('ログイン成功時に認証済みユーザーを保持する', async () => {
    const store = createAuthStore(createRepository());

    const result = await store
      .getState()
      .signIn({ email: user.email, password: 'password' });

    expect(result).toBe(true);
    expect(store.getState()).toMatchObject({
      status: 'authenticated',
      user,
      error: null,
    });
  });

  it('認証失敗時は入力を保持できるようエラーだけを公開する', async () => {
    const repository = createRepository({
      signIn: vi.fn().mockRejectedValue(new Error('認証に失敗しました')),
    });
    const store = createAuthStore(repository);

    const result = await store
      .getState()
      .signIn({ email: user.email, password: 'wrong-password' });

    expect(result).toBe(false);
    expect(store.getState()).toMatchObject({
      status: 'unauthenticated',
      user: null,
      error: '認証に失敗しました',
    });
  });

  it('送信中のログインを二重送信しない', async () => {
    let resolveSignIn: ((value: AuthUser) => void) | undefined;
    const signIn = vi.fn(
      () =>
        new Promise<AuthUser>((resolve) => {
          resolveSignIn = resolve;
        }),
    );
    const store = createAuthStore(createRepository({ signIn }));
    const input: SignUpInput = {
      email: user.email,
      password: 'password',
    };

    const first = store.getState().signIn(input);
    const second = store.getState().signIn(input);

    expect(signIn).toHaveBeenCalledTimes(1);
    expect(await second).toBe(false);
    resolveSignIn?.(user);
    await first;
  });

  it('新規登録成功時に確認対象のメールアドレスを返す', async () => {
    const store = createAuthStore(createRepository());

    const result = await store
      .getState()
      .signUp({ email: user.email, password: 'password' });

    expect(result).toBe(true);
    expect(store.getState()).toMatchObject({
      pendingVerificationEmail: user.email,
      error: null,
    });
  });
});
