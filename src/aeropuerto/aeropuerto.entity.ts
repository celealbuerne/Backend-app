import { Entity, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Localidad } from '../localidad/localidad.entity.js';
import { Aeronave } from '../aeronave/aeronave.entity.js';
import { Reserva } from '../reserva/reserva.entity.js';

@Entity()
export class Aeropuerto extends BaseEntity {
  @Property()
  nombre: string;

  @Property()
  codigo: string;

  @ManyToOne()
  laLocalidad: Localidad;

  @OneToMany({ mappedBy: 'origen' })
  reservasOrigen = new Collection<Reserva>(this);

  @OneToMany({ mappedBy: 'destino' })
  reservasDestino = new Collection<Reserva>(this);

  @OneToMany({ mappedBy: 'ultimoAeropuerto' })
  aeronavesAlojadas = new Collection<Aeronave>(this);

  constructor(_nombre: string, _codigo: string, _laLocalidad: Localidad) {
    super();
    this.nombre = _nombre;
    this.codigo = _codigo;
    this.laLocalidad = _laLocalidad;
  }
}
