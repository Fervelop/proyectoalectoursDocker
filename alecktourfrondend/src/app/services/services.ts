import { apiFetch } from '../api/v1/api';
import { 
  PaqueteResponse, PaqueteCreate, PaqueteUpdate,
  ReservaResponse, ReservaDetailResponse, ReservaCreate, ReservaUpdate,
  PagoResponse, PagoCreate
} from '../data/reservaTypes';


// Interfaces adicionales que deberías tener en tus tipos
export interface HotelResponse {
  id: number;
  nombre: string;
  // ... resto de propiedades
}

// ====================================================
// SERVICIO DE HOTELES
// ====================================================
export const hotelService = {
  getAll: async () => {
    // Apunta a: http://localhost:8000/api/v1/hoteles
    return apiFetch<HotelResponse[]>('/hoteles'); 
  },
  
  createReservation: async (reservationData: ReservaCreate) => {
    // Apunta a: http://localhost:8000/api/v1/reservas
    return apiFetch<ReservaResponse>('/reservas', {
      method: 'POST',
      body: reservationData,
    });
  }
};

// ====================================================
// SERVICIO DE PAQUETES
// ====================================================
export const paqueteService = {
  getAll: (skip = 0, limit = 10) => 
    apiFetch<PaqueteResponse[]>(`/paquetes?skip=${skip}&limit=${limit}`),

  getById: (id: number) => 
    apiFetch<PaqueteResponse>(`/paquetes/${id}`),

  create: (data: PaqueteCreate) => 
    apiFetch<PaqueteResponse>('/paquetes', { method: 'POST', body: data }),

  update: (id: number, data: PaqueteUpdate) => 
    apiFetch<PaqueteResponse>(`/paquetes/${id}`, { method: 'PUT', body: data }),

  delete: (id: number) => 
    apiFetch<{ message: string }>(`/paquetes/${id}`, { method: 'DELETE' })
};

// ====================================================
// SERVICIO DE RESERVAS
// ====================================================
export const reservaService = {
  getAll: (skip = 0, limit = 10) => 
    apiFetch<ReservaResponse[]>(`/reservas?skip=${skip}&limit=${limit}`),

  getById: (id: number) => 
    apiFetch<ReservaDetailResponse>(`/reservas/${id}`),

  getByCliente: (clienteId: number, skip = 0, limit = 10) => 
    apiFetch<ReservaResponse[]>(`/reservas/cliente/${clienteId}?skip=${skip}&limit=${limit}`),

  getByEstado: (estado: ReservaResponse['estado'], skip = 0, limit = 10) => 
    apiFetch<ReservaResponse[]>(`/reservas/estado/${estado}?skip=${skip}&limit=${limit}`),

  create: (data: ReservaCreate) => 
    apiFetch<ReservaResponse>('/reservas', { method: 'POST', body: data }),

  update: (id: number, data: ReservaUpdate) => 
    apiFetch<ReservaResponse>(`/reservas/${id}`, { method: 'PUT', body: data }),

  delete: (id: number) => 
    apiFetch<{ message: string }>(`/reservas/${id}`, { method: 'DELETE' })
};

// ====================================================
// SERVICIO DE PAGOS
// ====================================================
export const pagoService = {
  getAll: (skip = 0, limit = 10) => 
    apiFetch<PagoResponse[]>(`/pagos?skip=${skip}&limit=${limit}`),

  getByReserva: (reservaId: number) => 
    apiFetch<PagoResponse[]>(`/pagos/reserva/${reservaId}`),

  getByEstado: (estado: PagoResponse['estado'], skip = 0, limit = 10) => 
    apiFetch<PagoResponse[]>(`/pagos/estado/${estado}?skip=${skip}&limit=${limit}`),

  create: (data: PagoCreate) => 
    apiFetch<PagoResponse>('/pagos', { method: 'POST', body: data }),
};