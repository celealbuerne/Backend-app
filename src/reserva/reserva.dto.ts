import { EstadoReserva } from './reserva.entity.js';

export interface CreateReservaDTO {
  destino: string;
  cliente: number;
  publicacion: number;
  aeropuerto: number;
  fechaInicio: Date;
  fechaFin: Date;
}

export interface updateEstadoReservaDTO {
  estado: EstadoReserva;
}
