import type { User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';

import { deriveDisplayName } from '@/features/profile/utils/deriveDisplayName';
import { supabase } from '@/services/supabase/client';
import { AppError } from '@/types/AppError';

import type {
  AuthRepository,
  AuthStateListener,
  AuthUser,
  ChangeEmailInput,
  SignUpInput,
} from '../types/AuthRepository';

function toAuthUser(user: User | null): AuthUser {
  if (!user?.email) {
    throw new AppError(
      'authentication',
      '認証済みユーザーを確認できませんでした',
    );
  }

  return {
    id: user.id,
    email: user.email,
  };
}

function authenticationError(message: string, cause: unknown): AppError {
  return new AppError('authentication', message, cause);
}

export class SupabaseAuthRepository implements AuthRepository {
  async getCurrentUser(): Promise<AuthUser | null> {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw authenticationError('認証状態を確認できませんでした', error);
    }

    return data.session ? toAuthUser(data.session.user) : null;
  }

  onAuthStateChange(listener: AuthStateListener): () => void {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      listener(
        session ? toAuthUser(session.user) : null,
        event === 'SIGNED_OUT' ? 'signed_out' : undefined,
      );
    });

    return () => subscription.unsubscribe();
  }

  async signUp({ email, password }: SignUpInput): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: deriveDisplayName(email),
        },
      },
    });

    if (error) {
      throw authenticationError('アカウントを登録できませんでした', error);
    }

    return toAuthUser(data.user);
  }

  async signIn({ email, password }: SignUpInput): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw authenticationError(
        'メールアドレスまたはパスワードを確認してください',
        error,
      );
    }

    return toAuthUser(data.user);
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw authenticationError('ログアウトできませんでした', error);
    }
  }

  async resendSignupConfirmation(email: string): Promise<void> {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      throw authenticationError('確認メールを再送できませんでした', error);
    }
  }

  async sendPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window === 'undefined'
          ? Linking.createURL('/new-password')
          : `${window.location.origin}/new-password`,
    });

    if (error) {
      throw authenticationError(
        'パスワード再設定メールを送信できませんでした',
        error,
      );
    }
  }

  async updatePassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      throw authenticationError('パスワードを更新できませんでした', error);
    }
  }

  async updateEmail({
    currentEmail,
    newEmail,
    password,
  }: ChangeEmailInput): Promise<void> {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: currentEmail,
      password,
    });
    if (signInError) {
      throw authenticationError(
        '現在のパスワードを確認してください',
        signInError,
      );
    }

    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      {
        emailRedirectTo:
          typeof window === 'undefined'
            ? Linking.createURL('/settings')
            : `${window.location.origin}/settings`,
      },
    );
    if (error) {
      throw authenticationError('メールアドレスを変更できませんでした', error);
    }
  }

  async deleteAccount({ email, password }: SignUpInput): Promise<void> {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      throw authenticationError(
        '現在のパスワードを確認してください',
        signInError,
      );
    }

    const { error } = await supabase.functions.invoke('delete-account');
    if (error) {
      throw authenticationError('アカウントを削除できませんでした', error);
    }
    await supabase.auth.signOut({ scope: 'local' });
  }
}
