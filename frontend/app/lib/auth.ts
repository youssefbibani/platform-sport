export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";
export const AUTH_STORAGE_KEY = "auth_user";

export type AuthCache = {
  email?: string;
  role?: string;
  access?: string;
  refresh?: string;
  display_name?: string;
  handle?: string;
};

export function clearAuthCache() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event("auth-change"));
  } catch (error) {
    // Ignore cache errors.
  }
}

export function readAuthCache(): AuthCache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthCache;
  } catch (error) {
    return null;
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  const cached = readAuthCache();
  if (!cached?.refresh) return null;

  try {
    const response = await fetch(`${API_BASE}/api/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: cached.refresh }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      access?: string;
      code?: string;
    };
    if (!response.ok) {
      if (response.status === 401 || data.code === "token_not_valid") {
        clearAuthCache();
      }
      return null;
    }

    const nextAccess = typeof data.access === "string" ? data.access : "";
    if (!nextAccess) {
      clearAuthCache();
      return null;
    }

    const nextCache: AuthCache = {
      ...cached,
      access: nextAccess,
    };
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextCache));
    window.dispatchEvent(new Event("auth-change"));
    return nextAccess;
  } catch (error) {
    return null;
  }
}

export async function authorizedFetch(path: string, options: RequestInit = {}) {
  const cached = readAuthCache();
  const access = cached?.access;
  if (!access) return null;

  const target = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const baseHeaders = options.headers ? { ...options.headers } : {};

  let response = await fetch(target, {
    ...options,
    headers: {
      ...baseHeaders,
      Authorization: `Bearer ${access}`,
    },
  });

  if (response.status !== 401) return response;

  const refreshed = await refreshAccessToken();
  if (!refreshed) return null;

  response = await fetch(target, {
    ...options,
    headers: {
      ...baseHeaders,
      Authorization: `Bearer ${refreshed}`,
    },
  });

  if (response.status === 401) {
    clearAuthCache();
    return null;
  }

  return response;
}
