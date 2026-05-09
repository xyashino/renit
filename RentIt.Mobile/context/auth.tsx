// Deprecated compatibility layer.
// Prefer imports from `@/src/shared/auth/session` in new code.
export {
  AuthProvider,
  useAuthSessionState,
  useCurrentUser,
  useCurrentUserId,
  useIsAuthenticated,
  useLogout,
  type AuthUser,
} from '@/src/shared/auth/session';
