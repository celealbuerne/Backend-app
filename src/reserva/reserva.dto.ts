import { EstadoReserva } from "./reserva.entity.js";

export interface CreateReservaDTO {
  destino: string;
  usuario: number; //same
  publicacion: number; //no lo ingresa el usuario
  aeropuerto: number; //same
}

export interface updateEstadoReservaDTO {
    estado: EstadoReserva;
}

