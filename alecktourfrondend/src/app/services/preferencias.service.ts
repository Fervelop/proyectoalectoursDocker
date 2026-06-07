import { apiFetch } from '../api/v1/api';

export interface PreferenciaResponse {
  id_preferencia: number;
  id_cliente: number;
  intereses: string[];
  compania: string;
  presupuesto: string;
  clima: string;
  ritmo: string;
  transporte: string;
}

export const preferenciasService = {
  getByCliente: (id: number) =>
    apiFetch<PreferenciaResponse>(`/preferencias-cliente/${id}`),
  
  save: (id_cliente: number | string, data: any) =>
    apiFetch<PreferenciaResponse>('/preferencias-cliente/', { 
      method: 'POST', 
      body: {
        id_cliente,
        intereses: data.interests,
        compania: data.company,
        presupuesto: data.budget,
        clima: data.weather,
        ritmo: data.pace,
        transporte: data.transport,
      }
    }),
  
  // Alias para compatibilidad
  savePreferences: (id_cliente: number | string, data: any) =>
    apiFetch<PreferenciaResponse>('/preferencias-cliente/', { 
      method: 'POST', 
      body: {
        id_cliente,
        intereses: data.interests,
        compania: data.company,
        presupuesto: data.budget,
        clima: data.weather,
        ritmo: data.pace,
        transporte: data.transport,
      }
    }),
};