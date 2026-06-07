const BASE_URL = 'http://localhost:8000';  
const API_PREFIX = '/api';                 

interface FetchOptions extends RequestInit {
  body?: any;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${BASE_URL}${API_PREFIX}${endpoint}`;

  if (options.body && typeof options.body === 'object') {
    options.body = JSON.stringify(options.body);
    options.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error en la petición al servidor');
  }

  if (response.status === 204) return {} as T;

  return response.json() as Promise<T>;
}