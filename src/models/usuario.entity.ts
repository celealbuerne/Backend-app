import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';
import { Aeronave } from './aeronave.entity.js';

// TODO: autenticacion (login), no puede ir acá, ni lógica ni datos
@Entity()
export class Usuario extends BaseEntity<'aeronaves'> {
  @Property()
  estado: string = 'activo';

  @Property({ length: 50 })
  nombre: string;

  @Property()
  contacto: string[] = []; //podria ser una entidad Contacto ¿?

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
    _fechaNAcimiento: Date
  ) {
    super();
    this.nombre = _nombre;
    this.pais = _pais;
    this.tipoDocumento = _tipoDocumento;
    this.documento = _documento;
    this.fechaNacimiento = _fechaNAcimiento;
  }

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
