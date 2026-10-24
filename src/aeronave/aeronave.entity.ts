import { /*Collection*/ Entity, ManyToOne, Property, OneToOne } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Publicacion } from '../publicacion/publicacion.entity.js';
import { Aeropuerto } from '../aeropuerto/aeropuerto.entity.js';

@Entity()
export class Aeronave extends BaseEntity {
  @ManyToOne()
  proveedor: Usuario;

  @Property()
  modelo: string;

  @Property()
  fabricante: string;

  @Property({ length: 200 })
  descripcion: string = 'Sin descripcción';

  @Property()
  capacidad: number;

  @Property()
  autonomia: number;

  @Property()
  velocidadMaxima: number;

  @Property()
  antiguedad: Date;

  @OneToOne(() => Publicacion, { mappedBy: 'aeronave' })
  publicacion?: Publicacion;

  @ManyToOne(() => Aeropuerto, { inversedBy: 'aeronavesAlojadas' })
  ultimoAeropuerto: Aeropuerto;  

  constructor(
    _modelo: string,
    _fabricante: string,
    _capacidad: number,
    _autonomia: number,
    _velocidadMaxima: number,
    _antiguedad: Date,
    proveedor: Usuario,
    _aeropuertoActual: Aeropuerto,
    _descripcion: string = ''
  ) {
    super();
    this.modelo = _modelo;
    this.fabricante = _fabricante;
    this.capacidad = _capacidad;
    this.autonomia = _autonomia;
    this.velocidadMaxima = _velocidadMaxima;
    this.antiguedad = _antiguedad;
    this.proveedor = proveedor;
    this.ultimoAeropuerto = _aeropuertoActual;
    if (_descripcion) {
      this.descripcion = _descripcion;
    }
  }

  // Revisar en el MD
  // @Property()
  // tipo!: TipoAeronave;

  // Revisar en el MD
  // @OneToMany(() => Reserva, (reserva) =>reserva.miAeronave)
  // misReservas: Reserva = new Collection<Reserva>(this)
}
