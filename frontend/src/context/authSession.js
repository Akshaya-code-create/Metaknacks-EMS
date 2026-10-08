export const AUTH_STORAGE_KEYS = [
  'token',
  'role',
  'name',
  'assigned_constituency',
  'assigned_region',
  'assigned_mandal',
  'id'
];

export function clearStoredAuthData() {
  AUTH_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
}