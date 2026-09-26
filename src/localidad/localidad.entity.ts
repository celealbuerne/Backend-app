import { Entity, OneToMany, Property, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Aeropuerto } from '../aeropuerto/aeropuerto.entity.js';

@Entity()
export class Localidad extends BaseEntity {
  @Property()
  pais: string;

  @Property()
  provincia: string;

  @Property()
  nombre: string;

  @Property()
  codigoPostal: number;

  @OneToMany({ mappedBy: 'laLocalidad' })
  aeropuertos = new Collection<Aeropuerto>(this);

  constructor(_pais: string, _provincia: string, _nombre: string, _codigoPostal: number) {
    super();
    this.pais = _pais;
    this.provincia = _provincia;
    this.nombre = _nombre;
    this.codigoPostal = _codigoPostal;
  }
}
