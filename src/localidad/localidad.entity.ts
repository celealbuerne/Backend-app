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

  @OneToMany({ mappedBy: 'localidadID' })
  aeropuertos = new Collection<Aeropuerto>(this);
}
