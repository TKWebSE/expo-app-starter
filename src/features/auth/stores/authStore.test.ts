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
    resendSignupConfirmation: vi.fn().mockResolvedValue(undefined),
    sendPasswordReset: vi.fn().mockResolvedValue(undefined),
    updatePassword: vi.fn().mockResolvedValue(undefined),
    updateEmail: vi.fn().mockResolvedValue(undefined),
    deleteAccount: vi.fn().mockResolvedValue(undefined),
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

  it('予期しないサインアウト時はセッション期限切れを案内する', async () => {
    let listener: AuthStateListener | undefined;
    const repository = createRepository({
      getCurrentUser: vi.fn().mockResolvedValue(user),
      onAuthStateChange: vi.fn((nextListener: AuthStateListener) => {
        listener = nextListener;
        return () => undefined;
      }),
    });
    const store = createAuthStore(repository);
    await store.getState().initialize();

    listener?.(null, 'signed_out');

    expect(store.getState()).toMatchObject({
      status: 'unauthenticated',
      error: 'セッションの有効期限が切れました。もう一度ログインしてください',
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

  it('確認対象メールアドレスへ確認メールを再送する', async () => {
    const repository = createRepository();
    let now = 1_000;
    const store = createAuthStore(repository, () => now);
    await store.getState().signUp({ email: user.email, password: 'password' });
    now += 60_000;

    await expect(store.getState().resendVerification()).resolves.toBe(true);
    expect(repository.resendSignupConfirmation).toHaveBeenCalledWith(
      user.email,
    );
  });

  it('確認メールは送信後60秒間再送しない', async () => {
    const repository = createRepository();
    const store = createAuthStore(repository, () => 1_000);
    await store.getState().signUp({ email: user.email, password: 'password' });

    await expect(store.getState().resendVerification()).resolves.toBe(false);
    expect(repository.resendSignupConfirmation).not.toHaveBeenCalled();
  });

  it('パスワード再設定メールを送信する', async () => {
    const repository = createRepository();
    const store = createAuthStore(repository);

    await expect(store.getState().sendPasswordReset(user.email)).resolves.toBe(
      true,
    );
    expect(repository.sendPasswordReset).toHaveBeenCalledWith(user.email);
  });

  it('パスワード更新後はセッションを終了する', async () => {
    const repository = createRepository();
    const store = createAuthStore(repository);

    await expect(store.getState().updatePassword('new-password')).resolves.toBe(
      true,
    );
    expect(repository.updatePassword).toHaveBeenCalledWith('new-password');
    expect(repository.signOut).toHaveBeenCalled();
    expect(store.getState().status).toBe('unauthenticated');
  });

  it('再認証情報を使ってメール変更を要求する', async () => {
    const repository = createRepository({
      getCurrentUser: vi.fn().mockResolvedValue(user),
    });
    const store = createAuthStore(repository);
    await store.getState().initialize();

    await expect(
      store.getState().updateEmail('new@example.com', 'password'),
    ).resolves.toBe(true);
    expect(repository.updateEmail).toHaveBeenCalledWith({
      currentEmail: user.email,
      newEmail: 'new@example.com',
      password: 'password',
    });
  });

  it('再認証後にアカウントを削除して未認証にする', async () => {
    const repository = createRepository({
      getCurrentUser: vi.fn().mockResolvedValue(user),
    });
    const store = createAuthStore(repository);
    await store.getState().initialize();

    await expect(store.getState().deleteAccount('password')).resolves.toBe(
      true,
    );
    expect(repository.deleteAccount).toHaveBeenCalledWith({
      email: user.email,
      password: 'password',
    });
    expect(store.getState().status).toBe('unauthenticated');
  });
});
