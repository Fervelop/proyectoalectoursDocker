export interface ReservaResponse {
  id_reserva: number;
  id_cliente: number;
  id_empleado: number;
  id_paquete: number;
  fecha_reserva: string;
  fecha_inicio: string;
  fecha_fin: string;
  numero_personas: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'finalizada';
}

// NUEVO: representa una habitación específica dentro de una reserva
export interface HabitacionReservaCreate {
  id_habitacion: number;
  fecha_checkin: string;
  fecha_checkout: string;
}

export interface ReservaCreate {
  id_cliente: number;
  id_empleado?: number;
  id_paquete?: number;
  fecha_inicio: string;
  fecha_fin: string;
  numero_personas: number;
  estado?: string;
  // NUEVO: si se está reservando una habitación de hotel, va aquí.
  // El precio NO se manda desde el frontend: el backend lo calcula con el precio real de la BD.
  habitaciones?: HabitacionReservaCreate[];
}

export interface ReservaUpdate extends Partial<ReservaCreate> { }