/**
 * Plain (non-hook) auth token accessor for use outside React components,
 * e.g. HTTP middleware. This is the only place outside the authentication
 * domain that is allowed to import from its infrastructure layer.
 */
export { readStoredAuthToken as getStoredAuthToken } from '@authentication/infrastructure/session-storage';
