import { apiFetch } from '../api/v1/api';

export interface CaracteristicaResponse {
  id_caracteristica: number;
  nombre_caracteristica: string;
}

export interface HotelCaracteristicaResponse {
  id_hotel: number;
  id_caracteristica: number;
  disponible: boolean;
  caracteristica?: CaracteristicaResponse;
}

export interface TipoHabitacionResponse {
  id_tipo_habitacion: number;
  nombre_tipo: string;
  descripcion?: string;
  capacidad_personas: number;
}

export interface HabitacionResponse {
  id_habitacion: number;
  id_hotel: number;
  id_tipo_habitacion: number;
  numero_habitacion: string;
  precio_noche: number;
  estado: string;
  tipo_habitacion?: TipoHabitacionResponse;
}

export interface HotelResponse {
  id_hotel: number;
  nombre_hotel: string;
  calificacion: number;
  ciudad: string;
  pais: string;
  direccion?: string;
  codigo_postal?: string;
  correo_electronico: string;
  telefono: string;
}

export interface HotelDetailResponse extends HotelResponse {
  habitaciones: HabitacionResponse[];
  hotel_caracteristicas: HotelCaracteristicaResponse[];
}

export const hotelService = {
  getAll: (skip = 0, limit = 50) =>
    apiFetch<HotelResponse[]>(`/hoteles/?skip=${skip}&limit=${limit}`),

  getById: (id: number) =>
    apiFetch<HotelDetailResponse>(`/hoteles/${id}`),

  create: (data: Partial<HotelResponse>) =>
    apiFetch<HotelResponse>('/hoteles/', { method: 'POST', body: data }),

  update: (id: number, data: Partial<HotelResponse>) =>
    apiFetch<HotelResponse>(`/hoteles/${id}`, { method: 'PUT', body: data }),

  delete: (id: number) =>
    apiFetch<{ message: string }>(`/hoteles/${id}`, { method: 'DELETE' }),
};