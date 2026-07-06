import type { AuthenticatedUser } from './permissions';

const KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  REMEMBERED_EMAIL: 'remembered_email',
  USE_LOCAL_STORAGE: 'use_local_storage',
};

const getStorage = () => {
  const useLocal = localStorage.getItem(KEYS.USE_LOCAL_STORAGE) === "true";
  return useLocal ? localStorage : sessionStorage;
};

export const storage = {
  getAccessToken: () => {
    return getStorage().getItem(KEYS.ACCESS_TOKEN) || localStorage.getItem(KEYS.ACCESS_TOKEN) || sessionStorage.getItem(KEYS.ACCESS_TOKEN);
  },
  setAccessToken: (t: string) => getStorage().setItem(KEYS.ACCESS_TOKEN, t),
  getRefreshToken: () => {
    return getStorage().getItem(KEYS.REFRESH_TOKEN) || localStorage.getItem(KEYS.REFRESH_TOKEN) || sessionStorage.getItem(KEYS.REFRESH_TOKEN);
  },
  setTokens: (access: string, refresh: string) => {
    const store = getStorage();
    store.setItem(KEYS.ACCESS_TOKEN, access);
    store.setItem(KEYS.REFRESH_TOKEN, refresh);
  },
  getUser: (): AuthenticatedUser | null => {
    const u = getStorage().getItem(KEYS.USER) || localStorage.getItem(KEYS.USER) || sessionStorage.getItem(KEYS.USER);
    if (!u) return null;
    try {
      return JSON.parse(u) as AuthenticatedUser;
    } catch {
      return null;
    }
  },
  setUser: (user: AuthenticatedUser) => {
    getStorage().setItem(KEYS.USER, JSON.stringify(user));
  },
  getRememberedEmail: () => localStorage.getItem(KEYS.REMEMBERED_EMAIL),
  setRememberedEmail: (email: string) => localStorage.setItem(KEYS.REMEMBERED_EMAIL, email),
  clearRememberedEmail: () => localStorage.removeItem(KEYS.REMEMBERED_EMAIL),
  getUseLocalStorage: () => localStorage.getItem(KEYS.USE_LOCAL_STORAGE) === "true",
  setUseLocalStorage: (val: boolean) => localStorage.setItem(KEYS.USE_LOCAL_STORAGE, String(val)),
  clearUseLocalStorage: () => localStorage.removeItem(KEYS.USE_LOCAL_STORAGE),
  clearAll: () => {
    Object.values(KEYS).forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
  },
};
