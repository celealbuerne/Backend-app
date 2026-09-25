import { Collection, Entity, Enum, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Aeronave } from '../aeronave/aeronave.entity.js';
import { Contacto } from './contacto.entity.js';
import { Reserva } from '../reserva/reserva.entity.js';

export enum RolUsuario {
  CLIENTE = 'CLIENTE',
  PROVEEDOR = 'PROVEEDOR',
  ADMIN = 'ADMIN',
}

@Entity()
export class Usuario extends BaseEntity<'aeronaves'> {
  // de momento puede tener varios roles
  @Enum({ items: () => RolUsuario, array: true, default: [RolUsuario.CLIENTE] })
  roles: RolUsuario[] = [RolUsuario.CLIENTE];

  @Property()
  estado: string = 'activo';
  //estado: 'activo' | 'inactivo' = 'activo';en publicacion puse asi pero bueno habria q ver cual conviene mas

  @Property({ length: 50 })
  nombre: string;

  @Property({ length: 50 })
  usuario: string;

  @Property({ hidden: true })
  contrasena: string;

  @Property()
  contacto: Contacto[] = [];

  @Property()
  pais: string;

  @Property()
  fechaNacimiento: Date;

  @Property()
  tipoDocumento: string;

  @Property()
  documento: number;

  @OneToMany({ mappedBy: 'miProveedor' })
  aeronaves = new Collection<Aeronave>(this);

  @OneToMany({ mappedBy: 'usuario' })
  reservas = new Collection<Reserva>(this);

  constructor(
    _nombre: string,
    _pais: string,
    _tipoDocumento: string,
    _documento: number,
    _fechaNacimiento: Date
  ) {
    super();
    this.nombre = _nombre;
    this.pais = _pais;
    this.tipoDocumento = _tipoDocumento;
    this.documento = _documento;
    this.fechaNacimiento = _fechaNacimiento;
  }

  getCantidadContactos(): number {
    return this.contacto.length;
  }

  agregarContacto(nuevoContacto: Contacto): boolean {
    if (!this.contacto.includes(nuevoContacto)) {
      this.contacto.push(nuevoContacto);
      return true;
    }
    return false;
  }
}
