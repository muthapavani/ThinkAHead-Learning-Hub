const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  details?: string[];
  constructor(message: string, status: number, details?: string[]) {
    super(message); this.name = 'ApiError'; this.status = status; this.details = details;
  }
}

export function getToken() { return localStorage.getItem('tah_access_token'); }
export function setToken(token: string) { localStorage.setItem('tah_access_token', token); }
export function clearToken() { localStorage.removeItem('tah_access_token'); }

export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(data.message || 'Request failed.', response.status, data.errors);
  return data;
}

export async function uploadFile<T = any>(path: string, fieldName: string, file: File): Promise<T> {
  const token = getToken();
  const form = new FormData(); form.append(fieldName, file);
  const headers = new Headers(); if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API_BASE}${path}`, { method:'POST', headers, body:form });
  const data = await response.json().catch(()=>({}));
  if(!response.ok) throw new ApiError(data.message || 'Upload failed.', response.status, data.errors);
  return data;
}
