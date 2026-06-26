import type { AuthenticatedUser } from './permissions';

const KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
};

const getStorage = () => {
  const useLocal = localStorage.getItem("use_local_storage") === "true";
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
  clearAll: () => {
    Object.values(KEYS).forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
    localStorage.removeItem("use_local_storage");
  },
};
