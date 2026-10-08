import test from 'node:test';
import assert from 'node:assert/strict';
import { clearStoredAuthData, AUTH_STORAGE_KEYS } from './authSession.js';

const storage = new Map();
globalThis.localStorage = {
  getItem: key => (storage.has(key) ? storage.get(key) : null),
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: key => storage.delete(key),
  clear: () => storage.clear(),
};

test('clears all auth session keys from localStorage', () => {
  AUTH_STORAGE_KEYS.forEach(key => localStorage.setItem(key, `value:${key}`));

  clearStoredAuthData();

  AUTH_STORAGE_KEYS.forEach(key => {
    assert.equal(localStorage.getItem(key), null);
  });
});