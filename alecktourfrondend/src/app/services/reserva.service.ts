import { apiFetch } from '../api/v1/api';
import { ReservaResponse, ReservaCreate } from '../data/reservaTypes';

export interface MetodoPago {
  id_metodo: number;
  nombre_metodo: string;
}

export interface PagoCreate {
  id_reserva: number;
  id_metodo_pago: number;
  monto: number;
  referencia: string;
}

export interface PagoResponse {
  id_pago: number;
  id_reserva: number;
  id_metodo_pago: number;
  monto: number;
  fecha_pago: string;
  referencia: string;
  estado: string;
  metodo_pago: MetodoPago;
}

export const reservaService = {
  getAll: (skip = 0, limit = 50) =>
    apiFetch<ReservaResponse[]>(`/reservas?skip=${skip}&limit=${limit}`),
  getById: (id: number) =>
    apiFetch<ReservaResponse>(`/reservas/${id}`),
  getByCliente: (clienteId: number) =>
    apiFetch<ReservaResponse[]>(`/reservas/cliente/${clienteId}`),
  create: (data: ReservaCreate) =>
    apiFetch<ReservaResponse>('/reservas', { method: 'POST', body: data }),
  update: (id: number, data: Partial<ReservaCreate>) =>
    apiFetch<ReservaResponse>(`/reservas/${id}`, { method: 'PUT', body: data }),
  delete: (id: number) =>
    apiFetch<{ message: string }>(`/reservas/${id}`, { method: 'DELETE' }),
};

export const pagoService = {
  getMetodos: () =>
    apiFetch<MetodoPago[]>('/metodos-pago'),
  create: (data: PagoCreate) =>
    apiFetch<PagoResponse>('/pagos', { method: 'POST', body: data }),
};