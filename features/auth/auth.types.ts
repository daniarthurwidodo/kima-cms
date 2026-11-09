export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type PasswordUser = AuthUser & {
  passwordHash: string;
  isActive: boolean;
};

export type Session = {
  token: string;
  expiresAt: Date;
  user: AuthUser;
};

export type LoginInput = {
  email: string;
  password: string;
};
