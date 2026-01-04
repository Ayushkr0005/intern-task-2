const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function apiFetch(path: string, init: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    credentials: 'include',
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof data === 'object' && data && 'message' in data ? (data as any).message : 'Request failed';
    throw new Error(message);
  }

  return data;
}

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
};
