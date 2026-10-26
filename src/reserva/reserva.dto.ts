import { EstadoReserva } from './reserva.entity.js';

export interface CreateReservaDTO {
  destino: number;
  //cliente: number; sale del token
  publicacion: number;
  origen: number;
  fechaInicio: Date;
  fechaFin: Date;
}

export interface updateEstadoReservaDTO {
  nuevoEstado: EstadoReserva;
}
