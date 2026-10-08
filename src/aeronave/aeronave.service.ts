import { EntityData, RequiredEntityData } from '@mikro-orm/core';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { Aeronave } from './aeronave.entity.js';
import { CreateAeronaveDTO } from './createAeronave.dto.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Aeropuerto } from '../aeropuerto/aeropuerto.entity.js';
import { orm } from '../shared/db/orm.js';

export class AeronaveService {
  findAll = async () => {
    const aeronaves = await orm.em.findAll(Aeronave, {populate: ['elAeropuerto']});
    return aeronaves;
  };
//se agrega para poder identificar aeronaves del proveedor al crear una publicacion
  getByProveedor = async (proveedorId: number) => {
    const aeronaves = await orm.em.find(Aeronave, { miProveedor: proveedorId }, { populate: ['elAeropuerto'] });
    return aeronaves;
  };

  getOne = async (id: number) => {
    const aeronave = await orm.em.findOneOrFail(Aeronave, { id }, { populate: ['miProveedor', 'elAeropuerto'] });
    return aeronave;
  };

  //se agrego para poder identificar aeronaves del proveedor al crear una publicacion
  saveOne = async (input: CreateAeronaveDTO) => {
    const proveedor = await orm.em.findOne(Usuario, { id: input.miProveedor });
    if (!proveedor) {
      throw new BadRequestError('El proveedor ingresado no existe.');
    }
    const aeropuerto = await orm.em.findOne(Aeropuerto, { id: input.elAeropuerto });
    if (!aeropuerto) {
      throw new BadRequestError('El aeropuerto ingresado no existe.');
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
    const aeronave = await orm.em.findOneOrFail(Aeronave, { id });
    orm.em.remove(aeronave);
    await orm.em.flush();
    return;
  };
}
