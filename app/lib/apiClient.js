'use client';

let accessToken = null;

export const setAccessToken = (token) => { accessToken = token; };
export const getAccessToken = () => accessToken;

const refreshAccessToken = async () => {
  const res = await fetch(`/api/auth/refresh`, {
    method: 'POST',
    // Next.js fetch automatically includes cookies for same-origin requests
  });
  if (!res.ok) throw new Error('Refresh failed');
  const data = await res.json();
  accessToken = data.accessToken;
  return accessToken;
};

const apiFetch = async (endpoint, options = {}, retry = true) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options.headers
  };

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (res.status === 401 && retry) {
    try {
      await refreshAccessToken();
      return apiFetch(endpoint, options, false);
    } catch {
      accessToken = null;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:logout'));
      }
      throw new Error('Session expired');
    }
  }

  return res;
};

export default apiFetch;
