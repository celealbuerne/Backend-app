import { EstadoReserva } from './reserva.entity.js';

export interface FilterReservaDTO {
  estado?: EstadoReserva;
  cliente?: number;
  publicacion?: number;
}