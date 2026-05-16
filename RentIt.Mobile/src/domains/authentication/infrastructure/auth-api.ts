import { apiClient } from '@/src/shared/api/client';
import { parseApiItem } from '@/src/shared/infrastructure/parse-api';
import { MESSAGES } from '../constants';
import { ACCOUNT_TYPE_TO_API } from '../constants';
import { accountTypeFromApi, type AccountType } from '../domain/account-type';
import type { AuthUser } from '../domain/session';
import { authResponseDtoSchema, type AuthResponseDto } from '../application/schemas/auth';

export type AuthSessionInput = { token: string } & AuthUser;

function extractApiMessage(error: unknown, fallback: string): string {
  if (
    error !== null &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }
  return fallback;
}

function mapAuthResponse(data: AuthResponseDto): AuthSessionInput {
  const accountTypeRaw = data.accountType ?? data.AccountType;
  return {
    token: data.token,
    userId: data.userId,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    accountType: accountTypeFromApi(accountTypeRaw),
  };
}

function parseAuthResponse(data: unknown): AuthSessionInput {
  const dto = parseApiItem(authResponseDtoSchema, data, MESSAGES.API_LOGIN_FAILED);
  return mapAuthResponse(dto);
}

export async function loginApi(email: string, password: string): Promise<AuthSessionInput> {
  const { data, error } = await apiClient.POST('/api/auth/login', {
    body: { email, password },
  });
  if (error) throw new Error(extractApiMessage(error, MESSAGES.API_LOGIN_FAILED));
  return parseAuthResponse(data);
}

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: AccountType;
};

export async function registerApi(body: RegisterPayload): Promise<AuthSessionInput> {
  const accountType = ACCOUNT_TYPE_TO_API[body.accountType];
  if (accountType !== 0 && accountType !== 1) {
    throw new Error('Wybierz typ konta');
  }

  const { data, error } = await apiClient.POST('/api/auth/register', {
    body: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      accountType,
    },
  });
  if (error) throw new Error(extractApiMessage(error, MESSAGES.API_REGISTER_FAILED));
  const session = parseAuthResponse(data);
  if (session.accountType !== body.accountType) {
    throw new Error('Serwer zwrócił inny typ konta niż wybrany. Spróbuj ponownie.');
  }
  return session;
}
