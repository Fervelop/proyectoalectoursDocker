const BASE_URL = 'http://localhost:8000';

export interface UsuarioCreate {
  username: string;
  correo_electronico: string;
  password: string;
}

export interface UsuarioLogin {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
}

async function authFetch<T>(endpoint: string, body: object): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = Array.isArray(err.detail)
      ? err.detail.map((d: any) => d.msg).join(', ')
      : err.detail || 'Error en la autenticación';
    throw new Error(msg);
  }

  return response.json();
}

export const authService = {
  register: (data: UsuarioCreate) =>
    authFetch<{}>('/auth/register', data),

  login: (data: UsuarioLogin) =>
    authFetch<AuthResponse>('/auth/login', data),
};