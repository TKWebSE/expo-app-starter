export type Profile = {
  id: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
};

export interface ProfileRepository {
  findByUserId(userId: string): Promise<Profile>;
  updateDisplayName(userId: string, displayName: string): Promise<Profile>;
}
