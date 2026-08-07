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

export interface ReservaCreate {
  id_cliente: number;
  id_empleado: number;
  id_paquete: number;
  fecha_inicio: string;
  fecha_fin: string;
  numero_personas: number;
  estado?: string;
}

export interface ReservaUpdate extends Partial<ReservaCreate> {}