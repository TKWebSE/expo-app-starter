import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useStore } from 'zustand';

import { SupabaseAuthRepository } from '../repositories/SupabaseAuthRepository';
import { createAuthStore, type AuthStore } from './authStore';

type AuthStoreApi = ReturnType<typeof createAuthStore>;

const AuthStoreContext = createContext<AuthStoreApi | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [store] = useState(() => createAuthStore(new SupabaseAuthRepository()));

  useEffect(() => {
    void store.getState().initialize();

    return () => store.getState().dispose();
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
