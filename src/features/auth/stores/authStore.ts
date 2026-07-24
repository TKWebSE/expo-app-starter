import { createStore, type StoreApi } from 'zustand/vanilla';

import type {
  AuthRepository,
  AuthUser,
  SignUpInput,
} from '../types/AuthRepository';

export type AuthStatus = 'initializing' | 'unauthenticated' | 'authenticated';

export type AuthStore = {
  status: AuthStatus;
  user: AuthUser | null;
  isSubmitting: boolean;
  error: string | null;
  pendingVerificationEmail: string | null;
  verificationResendAvailableAt: number | null;
  initialize: () => Promise<void>;
  signIn: (input: SignUpInput) => Promise<boolean>;
  signUp: (input: SignUpInput) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  resendVerification: () => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  updateEmail: (newEmail: string, password: string) => Promise<boolean>;
  deleteAccount: (password: string) => Promise<boolean>;
  clearError: () => void;
  dispose: () => void;
};

function messageFrom(error: unknown): string {
  return error instanceof Error
    ? error.message
    : '予期しないエラーが発生しました';
}

export function createAuthStore(
  repository: AuthRepository,
  now: () => number = Date.now,
): StoreApi<AuthStore> {
  let unsubscribe: (() => void) | null = null;

  return createStore<AuthStore>((set, get) => ({
    status: 'initializing',
    user: null,
    isSubmitting: false,
    error: null,
    pendingVerificationEmail: null,
    verificationResendAvailableAt: null,

    initialize: async () => {
      try {
        const user = await repository.getCurrentUser();
        set({
          status: user ? 'authenticated' : 'unauthenticated',
          user,
          error: null,
        });
      } catch (error) {
        set({
          status: 'unauthenticated',
          user: null,
          error: messageFrom(error),
        });
      }

      unsubscribe?.();
      unsubscribe = repository.onAuthStateChange((user, reason) => {
        const sessionExpired =
          reason === 'signed_out' &&
          get().status === 'authenticated' &&
          !get().isSubmitting;
        set({
          status: user ? 'authenticated' : 'unauthenticated',
          user,
          error: sessionExpired
            ? 'セッションの有効期限が切れました。もう一度ログインしてください'
            : get().error,
        });
      });
    },

    signIn: async (input) => {
      if (get().isSubmitting) {
        return false;
      }

      set({ isSubmitting: true, error: null });
      try {
        const user = await repository.signIn(input);
        set({
          status: 'authenticated',
          user,
          isSubmitting: false,
        });
        return true;
      } catch (error) {
        set({
          status: 'unauthenticated',
          user: null,
          isSubmitting: false,
          error: messageFrom(error),
        });
        return false;
      }
    },

    signUp: async (input) => {
      if (get().isSubmitting) {
        return false;
      }

      set({ isSubmitting: true, error: null });
      try {
        const user = await repository.signUp(input);
        set({
          isSubmitting: false,
          pendingVerificationEmail: user.email,
          verificationResendAvailableAt: now() + 60_000,
        });
        return true;
      } catch (error) {
        set({
          isSubmitting: false,
          error: messageFrom(error),
        });
        return false;
      }
    },

    signOut: async () => {
      if (get().isSubmitting) {
        return false;
      }

      set({ isSubmitting: true, error: null });
      try {
        await repository.signOut();
        set({
          status: 'unauthenticated',
          user: null,
          isSubmitting: false,
        });
        return true;
      } catch (error) {
        set({
          isSubmitting: false,
          error: messageFrom(error),
        });
        return false;
      }
    },

    resendVerification: async () => {
      const email = get().pendingVerificationEmail;
      if (!email || get().isSubmitting) return false;
      if ((get().verificationResendAvailableAt ?? 0) > now()) {
        set({ error: '確認メールを再送できるまでお待ちください' });
        return false;
      }
      set({ isSubmitting: true, error: null });
      try {
        await repository.resendSignupConfirmation(email);
        set({
          isSubmitting: false,
          verificationResendAvailableAt: now() + 60_000,
        });
        return true;
      } catch (error) {
        set({ isSubmitting: false, error: messageFrom(error) });
        return false;
      }
    },

    sendPasswordReset: async (email) => {
      if (get().isSubmitting) return false;
      set({ isSubmitting: true, error: null });
      try {
        await repository.sendPasswordReset(email);
        set({ isSubmitting: false });
        return true;
      } catch (error) {
        set({ isSubmitting: false, error: messageFrom(error) });
        return false;
      }
    },

    updatePassword: async (password) => {
      if (get().isSubmitting) return false;
      set({ isSubmitting: true, error: null });
      try {
        await repository.updatePassword(password);
        await repository.signOut();
        set({ status: 'unauthenticated', user: null, isSubmitting: false });
        return true;
      } catch (error) {
        set({ isSubmitting: false, error: messageFrom(error) });
        return false;
      }
    },

    updateEmail: async (newEmail, password) => {
      const currentEmail = get().user?.email;
      if (!currentEmail || get().isSubmitting) return false;
      set({ isSubmitting: true, error: null });
      try {
        await repository.updateEmail({ currentEmail, newEmail, password });
        set({ isSubmitting: false });
        return true;
      } catch (error) {
        set({ isSubmitting: false, error: messageFrom(error) });
        return false;
      }
    },

    deleteAccount: async (password) => {
      const email = get().user?.email;
      if (!email || get().isSubmitting) return false;
      set({ isSubmitting: true, error: null });
      try {
        await repository.deleteAccount({ email, password });
        set({
          status: 'unauthenticated',
          user: null,
          isSubmitting: false,
        });
        return true;
      } catch (error) {
        set({ isSubmitting: false, error: messageFrom(error) });
        return false;
      }
    },

    clearError: () => set({ error: null }),
    dispose: () => {
      unsubscribe?.();
      unsubscribe = null;
    },
  }));
}
