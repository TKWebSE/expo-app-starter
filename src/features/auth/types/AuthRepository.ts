export type AuthUser = {
  id: string;
  email: string;
};

export type SignUpInput = {
  email: string;
  password: string;
};

export type AuthStateListener = (user: AuthUser | null) => void;

export interface AuthRepository {
  getCurrentUser(): Promise<AuthUser | null>;
  onAuthStateChange(listener: AuthStateListener): () => void;
  signUp(input: SignUpInput): Promise<AuthUser>;
  signIn(input: SignUpInput): Promise<AuthUser>;
  signOut(): Promise<void>;
  resendSignupConfirmation(email: string): Promise<void>;
  sendPasswordReset(email: string): Promise<void>;
  updatePassword(password: string): Promise<void>;
}
