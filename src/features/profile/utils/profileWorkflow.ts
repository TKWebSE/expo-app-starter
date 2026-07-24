import { displayNameSchema } from '../schemas/profileSchema';
import type { Profile, ProfileRepository } from '../types/ProfileRepository';

export function loadProfile(
  repository: ProfileRepository,
  userId: string,
): Promise<Profile> {
  return repository.findByUserId(userId);
}

export async function saveDisplayName(
  repository: ProfileRepository,
  userId: string,
  displayName: string,
): Promise<Profile> {
  const validatedDisplayName = displayNameSchema.parse(displayName);
  return await repository.updateDisplayName(userId, validatedDisplayName);
}

export function hasUnsavedDisplayName(
  initialDisplayName: string,
  currentDisplayName: string,
): boolean {
  return initialDisplayName.trim() !== currentDisplayName.trim();
}
