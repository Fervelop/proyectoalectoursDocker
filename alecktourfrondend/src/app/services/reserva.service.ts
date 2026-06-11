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

export interface ReservaDetail {
  id_reserva: number;
  id_cliente: number;
  id_paquete: number;
  fecha_reserva: string;
  fecha_inicio: string;
  fecha_fin: string;
  numero_personas: number;
  estado: string;
  paquete?: {
    id_paquete: number;
    nombre_paquete: string;
    descripcion: string;
    precio_por_persona: number;
    id_hotel: number;
    hotel?: {
      nombre_hotel: string;
      ciudad: string;
      pais: string;
      calificacion: number;
    };
  };
  pagos?: PagoResponse[];
}

export const reservaService = {
  getAll: (skip = 0, limit = 50) =>
    apiFetch<ReservaResponse[]>(`/reservas?skip=${skip}&limit=${limit}`),
  getById: (id: number) =>
    apiFetch<ReservaResponse>(`/reservas/${id}`),
  getByCliente: (clienteId: number) =>
    apiFetch<ReservaResponse[]>(`/reservas/cliente/${clienteId}`),
  getDetail: (id: number) =>
    apiFetch<ReservaDetail>(`/reservas/${id}`),
  getPagos: (reservaId: number) =>
    apiFetch<PagoResponse[]>(`/pagos/reserva/${reservaId}`),
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


export const reservaDetailService = {
  getHabitaciones: (id: number) =>
    apiFetch<any[]>(`/reservas/${id}/habitaciones`),
  getServicios: (id: number) =>
    apiFetch<any[]>(`/reservas/${id}/servicios`),
  getHistorial: (id: number) =>
    apiFetch<any[]>(`/reservas/${id}/historial`),
};