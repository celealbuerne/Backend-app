import { EntityData } from '@mikro-orm/core';
import { orm } from '../shared/db/orm.js';
import { CreateUsuarioDTO } from './createUsuario.dto.js';
import { RolUsuario, Usuario } from './usuario.entity.js';
import { BadRequestError } from '../shared/errors/badRequest.error.js';

export class UsuarioService {
  findAll = async () => {
    const usuarios = await orm.em.findAll(Usuario);
    return usuarios;
  };

  getOne = async (id: number) => {
    const usuario = orm.em.findOneOrFail(Usuario, { id });
    return usuario;
  };

  findByUsername = async (nombreUsuario: string) => {
    return await orm.em.findOne(Usuario, { nombreUsuario });
  };

  // dar de alta un usuario e interactuar con el ORM es responsabilidad del UsuarioService, NO de Auth
  create = async (input: CreateUsuarioDTO) => {
    const nuevoUsuario = orm.em.create(Usuario, {
      nombre: input.nombre,
      nombreUsuario: input.nombreUsuario,
      contraseña: input.contraseña,
      pais: input.pais,
      fechaNacimiento: input.fechaNacimiento,
      tipoDocumento: input.tipoDocumento,
      documento: input.documento,
      roles: input.roles ?? [RolUsuario.CLIENTE],
      estado: input.estado ?? 'activo',
      contacto: input.contacto ?? [], //<----- (sin revisar) TIRA ERROR, SERIA CONVENIENTE Q CONTACTO NO ESTE COMO CLASE SINO COMO ATRIBUTO
    });
    await orm.em.flush();
    return nuevoUsuario;
  };

  // TODO: separar agregar contactos, asi se estan sobreescribiendo si es patch
  updateOne = async (id: number, input: EntityData<Usuario>) => {
    const usuario = await orm.em.findOneOrFail(Usuario, { id });
    orm.em.assign(usuario, input);
    await orm.em.flush();
    return usuario;
  };

  removeOne = async (id: number) => {
    const usuario = await orm.em.findOne(Usuario, { id });
    if (!usuario) {
      throw new BadRequestError('El usuario ingresado no existe');
    }
    orm.em.remove(usuario);
    await orm.em.flush();
    return usuario;
  };
}
