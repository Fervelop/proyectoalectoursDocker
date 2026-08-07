import { apiFetch } from '../api/v1/api';

export interface PaquetePopular {
  id_paquete: number;
  nombre_paquete: string;
  descripcion: string;
  duracion_dias: number;
  precio_base: number;
  activo: boolean;
  total_reservas: number;
  calificacion_estimada: number;
}

export interface PaqueteResponse {
  id_paquete: number;
  nombre_paquete: string;
  descripcion: string;
  duracion_dias: number;
  precio_base: number;
  activo: boolean;
}

export const paqueteService = {
  getAll: (skip = 0, limit = 10) =>
    apiFetch<PaqueteResponse[]>(`/paquetes?skip=${skip}&limit=${limit}`),

  getById: (id: number) =>
    apiFetch<PaqueteResponse>(`/paquetes/${id}`),

  // Usa la vista vista_paquetes_populares del backend
  getPopulares: (limit = 6) =>
    apiFetch<PaquetePopular[]>(`/paquetes/populares?limit=${limit}`),

  create: (data: Partial<PaqueteResponse>) =>
    apiFetch<PaqueteResponse>('/paquetes', { method: 'POST', body: data }),

  update: (id: number, data: Partial<PaqueteResponse>) =>
    apiFetch<PaqueteResponse>(`/paquetes/${id}`, { method: 'PUT', body: data }),

  delete: (id: number) =>
    apiFetch<{ message: string }>(`/paquetes/${id}`, { method: 'DELETE' }),
};