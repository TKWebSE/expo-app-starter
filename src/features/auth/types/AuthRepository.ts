export type AuthUser = {
  id: string;
  email: string;
};

export type SignUpInput = {
  email: string;
  password: string;
};

export interface AuthRepository {
  signUp(input: SignUpInput): Promise<AuthUser>;
  signIn(input: SignUpInput): Promise<AuthUser>;
  signOut(): Promise<void>;
  sendPasswordReset(email: string): Promise<void>;
  updatePassword(password: string): Promise<void>;
}
