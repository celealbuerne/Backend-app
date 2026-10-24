import { Entity, Property, OneToMany, OneToOne, ManyToOne, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Aeronave } from '../aeronave/aeronave.entity.js';
import { Reserva } from '../reserva/reserva.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';

@Entity()
export class Publicacion extends BaseEntity {
  @Property()
  descripcion: string;

  @Property()
  precioPorDia: number;

  @Property()
  imagen: string;

  @OneToOne(() => Aeronave, { inversedBy: 'publicacion', owner: true })
  aeronave: Aeronave;

  @OneToMany({ mappedBy: 'publicacion' })
  reservas = new Collection<Reserva>(this);

  @ManyToOne(() => Usuario)
  proveedor: Usuario;

  constructor(
    _descripcion: string,
    _precioPorDia: number,
    _imagen: string,
    aeronave: Aeronave,
    proveedor: Usuario
  ) {
    super();
    this.descripcion = _descripcion;
    this.precioPorDia = _precioPorDia;
    this.imagen = _imagen;
    this.aeronave = aeronave;
    this.proveedor = proveedor;
  }
}
