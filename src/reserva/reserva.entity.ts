import {Entity, Property, ManyToOne, Enum} from '@mikro-orm/core';
import {BaseEntity} from '../shared/db/baseEntity.entity.js';
import {Usuario} from '../usuario/usuario.entity.js';
import {Publicacion} from '../publicacion/publicacion.entity.js';
import {Aeropuerto} from '../aeropuerto/aeropuerto.entity.js';

export enum EstadoReserva {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  RECHAZADA = 'rechazada',
  CANCELADA = 'cancelada'
}

@Entity()
export class Reserva extends BaseEntity {

  //SUPONEMOS QUE SOLO SE ALQUILA POR UN DIA
  //@Property()
  //fechaInicio: Date;

  //@Property()
  //fechaFin: Date;

  @Property()
  destino: string;

  @Property()
  montoTotal: number;

  @Enum(() => EstadoReserva)
  estado: EstadoReserva = EstadoReserva.PENDIENTE;
//estado: 'pendiente' | 'confirmada' | 'rechazada' = 'pendiente';
//cancelar reserva seria otro CUU asi q SE DEJA PARA AD

  @ManyToOne(() => Usuario)
  elUsuario: Usuario;

  @ManyToOne(() => Publicacion)
  laPublicacion: Publicacion;

  @ManyToOne(() => Aeropuerto)
  elAeropuerto: Aeropuerto;
  
  constructor(
    _destino: string,
    _montoTotal: number,
    _estado: EstadoReserva,
    _usuario: Usuario,
    _publicacion: Publicacion,
    _aeropuerto: Aeropuerto,
    ) {
    super();
    this.destino = _destino;
    this.montoTotal = _montoTotal;
    this.estado = _estado;
    this.elUsuario = _usuario;
    this.laPublicacion = _publicacion;
    this.elAeropuerto = _aeropuerto;
}

}

