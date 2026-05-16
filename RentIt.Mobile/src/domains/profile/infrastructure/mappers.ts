import { accountTypeFromApi } from '@/src/domains/authentication/domain/account-type';
import type { UserAccountType, UserProfile } from '../domain/user-profile';
import { parseApiItem } from '@/src/shared/infrastructure/parse-api';
import { userProfileDtoSchema, type UserProfileDto } from '../application/schemas/api';

function toUserAccountType(value: unknown): UserAccountType | undefined {
  if (value === undefined || value === null) return undefined;
  return accountTypeFromApi(value) === 'owner' ? 'Owner' : 'Client';
}

function mapUserProfileDto(dto: UserProfileDto): UserProfile {
  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    accountType: toUserAccountType(dto.accountType),
  };
}

export function parseUserProfile(data: unknown): UserProfile {
  const dto = parseApiItem(userProfileDtoSchema, data, 'Nieprawidłowa odpowiedź API (profil)');
  return mapUserProfileDto(dto);
}
