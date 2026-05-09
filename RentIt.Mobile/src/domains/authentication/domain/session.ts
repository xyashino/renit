export type AuthUser = {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};
