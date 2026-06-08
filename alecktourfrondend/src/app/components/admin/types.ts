export interface Reserva {
  id_reserva: number;
  id_cliente: number;
  id_paquete: number;
  fecha_inicio: string;
  fecha_fin: string;
  numero_personas: number;
  estado: string;
}

export interface HotelData {
  id_hotel: number;
  nombre_hotel: string;
  calificacion: number;
  ciudad: string;
  pais: string;
  correo_electronico: string;
  telefono: string;
}

export interface Paquete {
  id_paquete: number;
  nombre_paquete: string;
  descripcion: string;
  duracion_dias: number;
  precio_base: number;
  activo: boolean;
}

export interface Cliente {
  id_cliente: number;
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  celular: string;
  ciudad: string;
  pais: string;
}

export const ESTADO_COLOR: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  confirmada: "bg-green-100 text-green-700",
  cancelada: "bg-red-100 text-red-700",
  finalizada: "bg-blue-100 text-blue-700",
};

export const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none text-sm";
export const labelCls = "block text-sm font-medium text-gray-700 mb-1";