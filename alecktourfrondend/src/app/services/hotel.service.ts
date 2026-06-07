import { apiFetch } from '../api/v1/api';

export interface HotelResponse {
  id_hotel: number;
  nombre_hotel: string;
  calificacion: number;
  ciudad: string;
  pais: string;
  correo_electronico: string;
  telefono: string;
}

export const hotelService = {
  getAll: (skip = 0, limit = 50) =>
    apiFetch<HotelResponse[]>(`/hoteles/?skip=${skip}&limit=${limit}`),
  getById: (id: number) =>
    apiFetch<HotelResponse>(`/hoteles/${id}`),
  create: (data: Partial<HotelResponse>) =>
    apiFetch<HotelResponse>('/hoteles/', { method: 'POST', body: data }),
  update: (id: number, data: Partial<HotelResponse>) =>
    apiFetch<HotelResponse>(`/hoteles/${id}`, { method: 'PUT', body: data }),
  delete: (id: number) =>
    apiFetch<{ message: string }>(`/hoteles/${id}`, { method: 'DELETE' }),
};