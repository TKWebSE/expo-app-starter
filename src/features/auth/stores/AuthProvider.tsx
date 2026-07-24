import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as Linking from 'expo-linking';
import { useStore } from 'zustand';

import { SupabaseAuthRepository } from '../repositories/SupabaseAuthRepository';
import { recoveryTokensFromUrl } from '../utils/recoverySession';
import { supabase } from '@/services/supabase/client';
import { createAuthStore, type AuthStore } from './authStore';

type AuthStoreApi = ReturnType<typeof createAuthStore>;

const AuthStoreContext = createContext<AuthStoreApi | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [store] = useState(() => createAuthStore(new SupabaseAuthRepository()));

  useEffect(() => {
    void store.getState().initialize();
    const consumeRecoveryUrl = async (url: string | null) => {
      if (!url) return;
      const tokens = recoveryTokensFromUrl(url);
      if (tokens) {
        await supabase.auth.setSession({
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        });
      }
    };
    void Linking.getInitialURL().then(consumeRecoveryUrl);
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      void consumeRecoveryUrl(url);
    });

    return () => {
      linkingSubscription.remove();
      store.getState().dispose();
    };
  }, [store]);

  return (
    <AuthStoreContext.Provider value={store}>
      {children}
    </AuthStoreContext.Provider>
  );
}

export function useAuthStore<T>(selector: (state: AuthStore) => T): T {
  const store = useContext(AuthStoreContext);

  if (!store) {
    throw new Error('useAuthStoreはAuthProvider内で使用してください');
  }

  return useStore(store, selector);
}
