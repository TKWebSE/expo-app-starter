import { describe, expect, it, vi } from 'vitest';

import type { ProfileRepository } from '../types/ProfileRepository';
import {
  hasUnsavedDisplayName,
  loadProfile,
  saveDisplayName,
} from './profileWorkflow';

const profile = {
  id: 'user-1',
  displayName: '表示名',
  createdAt: '2026-07-24T00:00:00Z',
  updatedAt: '2026-07-24T00:00:00Z',
};

function createRepository(
  overrides: Partial<ProfileRepository> = {},
): ProfileRepository {
  return {
    findByUserId: vi.fn().mockResolvedValue(profile),
    updateDisplayName: vi.fn().mockResolvedValue(profile),
    ...overrides,
  };
}

describe('profileWorkflow', () => {
  it('認証ユーザーの表示名をRepositoryから取得する', async () => {
    const repository = createRepository();

    await expect(loadProfile(repository, 'user-1')).resolves.toEqual(profile);
    expect(repository.findByUserId).toHaveBeenCalledWith('user-1');
  });

  it('前後の空白を除いた表示名を保存する', async () => {
    const repository = createRepository();

    await saveDisplayName(repository, 'user-1', '  新しい表示名  ');

    expect(repository.updateDisplayName).toHaveBeenCalledWith(
      'user-1',
      '新しい表示名',
    );
  });

  it('不正な表示名はRepositoryへ送信しない', async () => {
    const repository = createRepository();

    await expect(
      saveDisplayName(repository, 'user-1', '   '),
    ).rejects.toBeDefined();
    expect(repository.updateDisplayName).not.toHaveBeenCalled();
  });

  it('前後の空白だけの差は未保存変更として扱わない', () => {
    expect(hasUnsavedDisplayName('表示名', '  表示名  ')).toBe(false);
    expect(hasUnsavedDisplayName('表示名', '別の表示名')).toBe(true);
  });
});
