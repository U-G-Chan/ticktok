export type StoredAuth = {
  accessToken: string;
  refreshToken: string;
  userId: number;
};

const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_ID_KEY = "user_id";

const notifyAuthChanged = () => {
  window.dispatchEvent(new Event("auth-changed"));
};

export function getAccessToken(): string | null {
  const t = localStorage.getItem(ACCESS_TOKEN_KEY);
  return t && t.trim() ? t : null;
}

export function getRefreshToken(): string | null {
  const t = localStorage.getItem(REFRESH_TOKEN_KEY);
  return t && t.trim() ? t : null;
}

export function getStoredUserId(): number | null {
  const raw = localStorage.getItem(USER_ID_KEY);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function setAuth(auth: StoredAuth) {
  localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
  localStorage.setItem(USER_ID_KEY, String(auth.userId));
  notifyAuthChanged();
}

export function setAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  notifyAuthChanged();
}

export function setRefreshToken(refreshToken: string) {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  notifyAuthChanged();
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  notifyAuthChanged();
}
