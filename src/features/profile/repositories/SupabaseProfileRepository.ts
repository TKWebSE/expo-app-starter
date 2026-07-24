import { supabase } from '@/services/supabase/client';
import { AppError } from '@/types/AppError';

import type { Profile, ProfileRepository } from '../types/ProfileRepository';

type ProfileRow = {
  id: string;
  display_name: string;
  created_at: string;
  updated_at: string;
};

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    displayName: row.display_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class SupabaseProfileRepository implements ProfileRepository {
  async findByUserId(userId: string): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, created_at, updated_at')
      .eq('id', userId)
      .single<ProfileRow>();

    if (error) {
      throw new AppError(
        error.code === 'PGRST116' ? 'not_found' : 'unexpected',
        'プロフィールを取得できませんでした',
        error,
      );
    }

    return toProfile(data);
  }

  async updateDisplayName(
    userId: string,
    displayName: string,
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', userId)
      .select('id, display_name, created_at, updated_at')
      .single<ProfileRow>();

    if (error) {
      throw new AppError(
        'unexpected',
        'プロフィールを保存できませんでした',
        error,
      );
    }

    return toProfile(data);
  }
}
