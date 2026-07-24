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
  initialize: () => Promise<void>;
  signIn: (input: SignUpInput) => Promise<boolean>;
  signUp: (input: SignUpInput) => Promise<boolean>;
  signOut: () => Promise<boolean>;
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
): StoreApi<AuthStore> {
  let unsubscribe: (() => void) | null = null;

  return createStore<AuthStore>((set, get) => ({
    status: 'initializing',
    user: null,
    isSubmitting: false,
    error: null,
    pendingVerificationEmail: null,

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
      unsubscribe = repository.onAuthStateChange((user) => {
        set({
          status: user ? 'authenticated' : 'unauthenticated',
          user,
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

    clearError: () => set({ error: null }),
    dispose: () => {
      unsubscribe?.();
      unsubscribe = null;
    },
  }));
}
