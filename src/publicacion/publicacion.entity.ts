import { Entity, Property, OneToMany, OneToOne, ManyToOne, Rel, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Aeronave } from '../aeronave/aeronave.entity.js';
import { Reserva } from '../reserva/reserva.entity.js';

@Entity()
export class Publicacion extends BaseEntity {
  @Property()
  fechaInicioDisponibilidad: Date;

  @Property()
  fechaFinDisponibilidad: Date;

  @Property()
  descripcion: string;

  @Property()
  precioPorKM: number;

  @Property()
  imagen: string;

  //RELACION UNO A UNO, DUEÑA PUBLICACION
  @OneToOne(() => Aeronave, { inversedBy: 'miPublicacion' })
  laAeronave!: Aeronave;

  @OneToMany(() => Reserva, (reserva) => reserva.publicacion)
  reservas = new Collection<Reserva>(this);

  //NO IRIA PQ PUBLI SE REALACIONA CON AERONAVE, Q AERONAVE SE RELACIONA CON USUARIO/PROVEEDOR REVISAR MD
  //  @ManyToOne(() => Usuario)
  // elProveedor: Rel<Usuario>;

  constructor(
    _fechaInicioDisponibilidad: Date,
    _fechaFinDisponibilidad: Date,
    _descripcion: string,
    _precioPorKM: number,
    _imagen: string
  ) {
    super();
    this.fechaInicioDisponibilidad = _fechaInicioDisponibilidad;
    this.fechaFinDisponibilidad = _fechaFinDisponibilidad;
    this.descripcion = _descripcion;
    this.precioPorKM = _precioPorKM;
    this.imagen = _imagen;
  }
}
