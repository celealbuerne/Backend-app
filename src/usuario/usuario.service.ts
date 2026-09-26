import { EntityData } from '@mikro-orm/core';
import { orm } from '../shared/db/orm.js';
import { CreateUsuarioDTO } from './createUsuario.dto.js';
import { Usuario } from './usuario.entity.js';
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

  //PARA REGISTRARSE AHORA ESTARIA EN AUTH CON EL LOGIN DEBERIAMOS BORRAR ESTO
  /* saveOne = async (input: CreateUsuarioDTO) => {
    const nuevoUsuario = orm.em.create(Usuario, {
      nombre: input.nombre,
      pais: input.pais,
      tipoDocumento: input.tipoDocumento,
      documento: input.documento,
      fechaNacimiento: input.fechaNacimiento,
      contacto: input.contacto, //<----- TIRA ERROR, SERIA CONVENIENTE Q CONTACTO NO ESTE COMO CLASE SINO COMO ATRIBUTO
    });
    await orm.em.flush();
    return nuevoUsuario;
  }; */

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
