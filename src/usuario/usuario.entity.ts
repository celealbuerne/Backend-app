import { Collection, Entity, Enum, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Aeronave } from '../aeronave/aeronave.entity.js';
import { Contacto } from './contacto.entity.js';
import { Reserva } from '../reserva/reserva.entity.js';
import { Publicacion } from '../publicacion/publicacion.entity.js';

export enum RolUsuario {
  CLIENTE = 'CLIENTE',
  PROVEEDOR = 'PROVEEDOR',
  ADMIN = 'ADMIN',
}

export enum EstadoUsuario {
  ACTIVO = 'ACTIVO',
  SUSPENDIDO = 'SUSPENDIDO',
}

@Entity()
export class Usuario extends BaseEntity<'aeronaves' | 'estado' | 'roles'> {
  // de momento puede tener varios roles
  @Enum({ items: () => RolUsuario, array: true, default: [RolUsuario.CLIENTE] })
  roles: RolUsuario[] = [RolUsuario.CLIENTE];

  @Enum({ items: () => EstadoUsuario, default: EstadoUsuario.ACTIVO })
  estado: EstadoUsuario = EstadoUsuario.ACTIVO;

  @Property({ length: 50 })
  nombre: string;

  @Property({ length: 50, unique: true })
  nombreUsuario: string;

  @Property({ hidden: true })
  contraseña: string;

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

  @OneToMany({ mappedBy: 'proveedor' })
  aeronaves = new Collection<Aeronave>(this);

  @OneToMany({ mappedBy: 'cliente' })
  reservas = new Collection<Reserva>(this);

  @OneToMany({ mappedBy: 'proveedor' })
  publicaciones = new Collection<Publicacion>(this);

  constructor(
    _nombre: string,
    _pais: string,
    _tipoDocumento: string,
    _documento: number,
    _fechaNacimiento: Date
  ) {
    super();
    this.nombre = _nombre;
    this.nombreUsuario = _nombre;
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
