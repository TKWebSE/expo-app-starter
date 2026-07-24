import type { User } from '@supabase/supabase-js';

import { deriveDisplayName } from '@/features/profile/utils/deriveDisplayName';
import { supabase } from '@/services/supabase/client';
import { AppError } from '@/types/AppError';

import type {
  AuthRepository,
  AuthUser,
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

  async sendPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

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
}
