import { EntityData, FilterQuery } from '@mikro-orm/core';
import { Aeropuerto } from './aeropuerto.entity.js';
import { CreateAeropuertoDTO } from './createAeropuerto.dto.js';
import { FilterAeropuertoDTO } from './filterAeropuerto.dto.js';
import { orm } from '../shared/db/orm.js';
import { Localidad } from '../localidad/localidad.entity.js';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { NotFoundIDError } from '../shared/errors/notFound.error.js';

export class AeropuertoService {
  findAll = async (filtros?: FilterAeropuertoDTO) => {
    const where: FilterQuery<Aeropuerto> = {};

    if (filtros?.nombre) {
      where.nombre = { $like: `%${filtros.nombre}%` };
    }

    if (filtros?.codigo) {
      where.codigo = { $like: `%${filtros.codigo}%` };
    }

    if (filtros?.localidadID !== undefined || filtros?.localidadNombre) {
      const localidadWhere: FilterQuery<Localidad> = {};
      if (filtros.localidadID !== undefined) {
        localidadWhere.id = filtros.localidadID;
      }
      if (filtros.localidadNombre) {
        localidadWhere.nombre = { $like: `%${filtros.localidadNombre}%` };
      }
      where.localidadID = localidadWhere;
    }

    const aeropuertos = await orm.em.find(Aeropuerto, where, {
      populate: ['localidadID'],
    });
    return aeropuertos;
  };

  getOne = async (id: number) => {
    const aeropuerto = await orm.em.findOne(Aeropuerto, { id }, { populate: ['localidadID'] });
    if (!aeropuerto) {
      throw new NotFoundIDError('El aeropuerto ingresado no existe.');
    }
    return aeropuerto;
  };

  saveOne = async (input: CreateAeropuertoDTO) => {
    const localidad = await orm.em.findOne(Localidad, { id: input.localidadID });
    if (!localidad) {
      throw new BadRequestError('La localidad ingresada no existe.');
    }

    const nuevoAeropuerto = orm.em.create(Aeropuerto, {
      nombre: input.nombre,
      codigo: input.codigo,
      localidadID: localidad,
    });
    await orm.em.flush();
    return nuevoAeropuerto;
  };

  updateOne = async (id: number, input: EntityData<Aeropuerto>) => {
    const aeropuerto = await orm.em.findOne(Aeropuerto, { id });
    if (!aeropuerto) {
      throw new BadRequestError('El aeropuerto ingresado no existe.');
    }
    orm.em.assign(aeropuerto, input);
    await orm.em.flush();
    return aeropuerto;
  };

  removeOne = async (id: number) => {
    const aeropuerto = await orm.em.findOne(Aeropuerto, { id });
    if (!aeropuerto) {
      throw new BadRequestError('El aeropuerto ingresado no existe.');
    }
    orm.em.remove(aeropuerto);
    await orm.em.flush();
    return aeropuerto;
  };
}
