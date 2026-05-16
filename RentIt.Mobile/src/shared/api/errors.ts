export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message = 'Unauthorized') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 401;
  }
  if (error !== null && typeof error === 'object' && 'status' in error) {
    return (error as { status: unknown }).status === 401;
  }
  return false;
}

export function extractApiMessage(error: unknown, fallback: string): string {
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
