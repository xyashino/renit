export type UserAccountType = 'Client' | 'Owner';

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  accountType?: UserAccountType;
}
