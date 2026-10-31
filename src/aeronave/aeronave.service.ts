import { EntityData, FilterQuery, RequiredEntityData } from '@mikro-orm/core';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { Aeronave } from './aeronave.entity.js';
import { CreateAeronaveDTO } from './createAeronave.dto.js';
import { FilterAeronaveDTO } from './filterAeronave.dto.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Aeropuerto } from '../aeropuerto/aeropuerto.entity.js';
import { orm } from '../shared/db/orm.js';

export class AeronaveService {
  findAll = async (filtros?: FilterAeronaveDTO) => {
    // esto puede ser undefined, asi que hay que ir con cuidado
    const where: FilterQuery<Aeronave> = {};

    if (filtros?.modelo) {
      where.modelo = { $like: `%${filtros.modelo}%` };
    }

    if (filtros?.fabricante) {
      where.fabricante = { $like: `%${filtros.fabricante}%` };
    }

    if (filtros?.capacidad !== undefined) {
      where.capacidad = filtros.capacidad;
    } else if (filtros?.capacidadMin !== undefined || filtros?.capacidadMax !== undefined) {
      where.capacidad = {};
      if (filtros.capacidadMin !== undefined) where.capacidad.$gte = filtros.capacidadMin;
      if (filtros.capacidadMax !== undefined) where.capacidad.$lte = filtros.capacidadMax;
    }

    if (filtros?.proveedor !== undefined) {
      where.proveedor = filtros.proveedor;
    }

    const aeronaves = await orm.em.find(Aeronave, where, {
      populate: ['ultimoAeropuerto', 'proveedor'], // proveedor puede volar de aca
    });
    return aeronaves;
  };

  // se agrega para poder identificar aeronaves del proveedor al crear una publicacion o ver sus aeronaves
  getByProveedor = async (proveedorId: number, filtros?: Omit<FilterAeronaveDTO, 'proveedor'>) => {
    return await this.findAll({ ...filtros, proveedor: proveedorId });
  };

  getOne = async (id: number) => {
    const aeronave = await orm.em.findOneOrFail(
      Aeronave,
      { id },
      { populate: ['proveedor', 'ultimoAeropuerto'] }
    );
    return aeronave;
  };

  //se agrego para poder identificar aeronaves del proveedor al crear una publicacion
  saveOne = async (input: CreateAeronaveDTO, proveedorId: number) => {
    const aeropuerto = await orm.em.findOne(Aeropuerto, { id: input.ultimoAeropuerto });
    if (!aeropuerto) {
      throw new BadRequestError('El aeropuerto ingresado no existe.');
    }

    const nuevaAeronave = orm.em.create(Aeronave, { ...input, proveedor: proveedorId } as RequiredEntityData<Aeronave>);
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
