import { Collection, Entity, Enum, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Aeronave } from '../aeronave/aeronave.entity.js';
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
export class Usuario extends BaseEntity<'aeronaves' | 'estado' | 'roles' | 'contacto'> {
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

  @Property({ type: 'json' })
  contacto: string[] = [];

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

  getCantidadContactos(): number {
    return this.contacto.length;
  }

  agregarContacto(nuevoContacto: string): boolean {
    if (!this.contacto.includes(nuevoContacto)) {
      this.contacto.push(nuevoContacto);
      return true;
    }
    return false;
  }
}
