import { Entity, Property, ManyToOne, Enum /*OneToOne*/ } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Publicacion } from '../publicacion/publicacion.entity.js';
import { Aeropuerto } from '../aeropuerto/aeropuerto.entity.js';

export enum EstadoReserva {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  RECHAZADA = 'RECHAZADA',
  CANCELADA = 'CANCELADA',
}

@Entity()
export class Reserva extends BaseEntity {
  @Property()
  fechaInicio: Date;

  @Property()
  fechaFin: Date;

  @Property()
  montoTotal: number;

  @Enum(() => EstadoReserva)
  estado: EstadoReserva = EstadoReserva.PENDIENTE;

  @ManyToOne()
  origen: Aeropuerto;

  @ManyToOne()
  destino: Aeropuerto;

  @ManyToOne()
  cliente: Usuario;

  @ManyToOne()
  publicacion: Publicacion;

  //cancelar reserva seria otro CUU asi q SE DEJA PARA AD

  // @OneToOne()
  // pago: Pago;

  constructor(
    _destino: Aeropuerto,
    _origen: Aeropuerto,
    _montoTotal: number,
    _estado: EstadoReserva,
    _cliente: Usuario,
    _publicacion: Publicacion,
    _fechaInicio: Date,
    _fechaFin: Date
  ) {
    super();
    this.origen = _origen;
    this.destino = _destino;
    this.montoTotal = _montoTotal;
    this.estado = _estado;
    this.cliente = _cliente;
    this.publicacion = _publicacion;
    this.fechaInicio = _fechaInicio;
    this.fechaFin = _fechaFin;
  }
}
