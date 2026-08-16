import { EntityData, RequiredEntityData } from '@mikro-orm/core';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { Aeronave } from './aeronave.entity.js';
import { CreateAeronaveDTO } from './createAeronave.dto.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { orm } from '../shared/db/orm.js';

export class AeronaveService {
  findAll = async () => {
    const aeronaves = await orm.em.findAll(Aeronave);
    return aeronaves;
  };

  getOne = async (id: number) => {
    const aeronave = await orm.em.findOneOrFail(Aeronave, { id }, { populate: ['miProveedor'] });
    return aeronave;
  };

  saveOne = async (input: CreateAeronaveDTO) => {
    const proveedor = await orm.em.findOne(Usuario, { id: input.miProveedor });
    if (!proveedor) {
      throw new BadRequestError('El proveedor ingresado no existe.');
    }
    const nuevaAeronave = orm.em.create(Aeronave, input as RequiredEntityData<Aeronave>);
    await orm.em.flush();
    return nuevaAeronave;
  };

  updateOne = async (id: number, input: EntityData<Aeronave>) => {
    const aeronave = await orm.em.findOneOrFail(Aeronave, { id });
    orm.em.assign(aeronave, input);
    await orm.em.flush();
    return aeronave;
  };

  removeOne = async (id: number) => {
    // esto obtiene la referencia sin cargar el objeto
    const aeronave = orm.em.getReference(Aeronave, id);
    orm.em.remove(aeronave);
    await orm.em.flush();
    return;
  };
}
