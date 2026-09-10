import { Collection, Entity, Enum, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Aeronave } from '../aeronave/aeronave.entity.js';
import { Contacto } from './contacto.entity.js';

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

  @Property({ length: 50 })
  nombre: string;

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
