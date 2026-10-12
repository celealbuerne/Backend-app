import { Publicacion } from './publicacion.entity.js';
import { orm } from '../shared/db/orm.js';
import { EntityData, FilterQuery } from '@mikro-orm/core';
import { CreatePublicacionDTO, UpdatePublicacionDTO } from './publicacion.dto.js';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { Aeronave } from '../aeronave/aeronave.entity.js';
import { Reserva } from '../reserva/reserva.entity.js';
import { EstadoReserva } from '../reserva/reserva.entity.js';

// const LIMITE_POR_DEFECTO = 10;

export class PublicacionService {
  constructor(private LIMITE_POR_DEFECTO: number = 10) {}

  findAll = async (precioMin?: number, precioMax?: number) => {
    // filtro de precio
    const where: FilterQuery<Publicacion> = {};
    if (precioMin !== undefined || precioMax !== undefined) {
      where.precioPorKM = {
        ...(precioMin !== undefined && { $gte: precioMin }), // si la primera parte de false, ...false no devuelve nada
        ...(precioMax !== undefined && { $lte: precioMax }), // si da true, spread de la segunda parte
      };
    }
    /*
    // const filtro: any = { fechaFinDisponibilidad: { $gte: new Date() } };

    const filtro: Record<string, any> = { };
    if (precioMax !== undefined || precioMin !== undefined) {
      filtro.precioPorKM = {};

      if (precioMax !== undefined) {
        filtro.precioPorKM.$lte = precioMax;
      }
      if (precioMin !== undefined) {
        filtro.precioPorKM.$gte = precioMin;
      }
    }
    */
    return await orm.em.find(Publicacion, where, {
      populate: ['aeronave.ultimoAeropuerto'],
      //orderBy: { fechaAlta: 'DESC' },  <--- podria ser para reemplazar lo de destacadas por recientes
    });
  };

  getOne = async (id: number) => {
    const publicacion = await orm.em.findOneOrFail(
      Publicacion,
      { id },
      { populate: ['aeronave.ultimoAeropuerto'] }
    );
    return publicacion;
  };

  //va imagen: string pq el service guarda el nombre de la img
  saveOne = async (input: CreatePublicacionDTO, imagen: string, proveedorID: number) => {
    const aeronave = await orm.em.findOne(
      Aeronave,
      { id: input.aeronaveID },
      { populate: ['publicacion', 'proveedor'] }
    );

    if (!aeronave) {
      throw new BadRequestError('La aeronave ingresada no existe.');
    }
    if (aeronave.proveedor.id !== proveedorID) {
      throw new BadRequestError('La aeronave no pertenece al proveedor.');
    }
    if (aeronave.publicacion) {
      throw new BadRequestError('La aeronave ingresada ya tiene una publicación asociada.');
    }

    const nuevaPublicacion = orm.em.create(Publicacion, {
      /*
      fechaInicioDisponibilidad: input.fechaInicioDisponibilidad,
      fechaFinDisponibilidad: input.fechaFinDisponibilidad,
      */
      descripcion: input.descripcion,
      precioPorKM: input.precioPorKM,
      imagen,
      aeronave: aeronave,
      proveedor: proveedorID,
    });

    await orm.em.flush();
    return nuevaPublicacion;
  };

  //-----REVISAR NO ESTA TERMINADA-----// no compara nada todavia

  updateOne = async (id: number, input: UpdatePublicacionDTO, imagen?: string) => {
    const publicacion = await orm.em.findOne(Publicacion, { id });
    if (!publicacion) throw new BadRequestError('La publicacion ingresada no existe');
    /* Si se modifican las fechas, verificamos que no haya
    reservas activas que queden fuera del nuevo período 
    if (
      input.fechaInicioDisponibilidad !== undefined ||
      input.fechaFinDisponibilidad !== undefined
    ) {
      const nuevaFechaInicio =
        input.fechaInicioDisponibilidad ?? publicacion.fechaInicioDisponibilidad;
        
        const nuevaFechaFin = input.fechaFinDisponibilidad ?? publicacion.fechaFinDisponibilidad;
        
        const reservasActivas = await orm.em.find(Reserva, {
          publicacion: { id },
          estado: { $in: [EstadoReserva.CONFIRMADA, EstadoReserva.PENDIENTE] },
        });
      }
      */

    orm.em.assign(publicacion, input as EntityData<Publicacion>);
    if (imagen !== undefined) {
      publicacion.imagen = imagen;
    }
    await orm.em.flush();
    return publicacion;
  };

  removeOne = async (id: number) => {
    const publicacion = await orm.em.findOne(Publicacion, { id });
    if (!publicacion) throw new BadRequestError('La publicacion ingresada no existe');

    const reservasActivas = await orm.em.find(Reserva, {
      publicacion: { id },
      estado: { $in: [EstadoReserva.CONFIRMADA, EstadoReserva.PENDIENTE] },
    });

    if (reservasActivas.length > 0) {
      throw new BadRequestError(
        'No se puede eliminar la publicación porque tiene reservas activas o pendientes'
      );
    }

    orm.em.remove(publicacion);
    await orm.em.flush();
    return { eliminada: true };
  };

  //----------------------------------------------------------------------------------//

  // PROVEEDOR
  //publicaciones del proveedor
  findMisPublicaciones = async (proveedorID: number) => {
    const publicaciones = await orm.em.find(
      Publicacion,
      { aeronave: { proveedor: proveedorID } },
      { populate: ['aeronave.ultimoAeropuerto'] }
    );
    return publicaciones;
  };

  //----------------------------------------------------------------------------------//
  // CLIENTE - busca en vez de destacadas las mas recientes, puse las 4 mas recientes pero revisar si queda bien con la pag
  findByRecientes = async () => {
    const publicaciones = await orm.em.find(
      Publicacion,
      {},
      {
        populate: ['aeronave', 'aeronave.ultimoAeropuerto'],
        orderBy: { fechaAlta: 'DESC', id: 'DESC' },
        limit: this.LIMITE_POR_DEFECTO,
      }
    );
    return publicaciones;
  };
}

{
  /* prodriamos unir FindAll Y FindByRecientes 
findAll = async (precioMin?: number, precioMax?: number, limite?: number) => {
  const filtro: any = { fechaFinDisponibilidad: { $gte: new Date() } };
  if (precioMax !== undefined || precioMin !== undefined) {
    filtro.precioPorKM = {};
    if (precioMax !== undefined) filtro.precioPorKM.$lte = precioMax;
    if (precioMin !== undefined) filtro.precioPorKM.$gte = precioMin;
  }

  return orm.em.find(Publicacion, filtro, {
    populate: ['laAeronave.elAeropuerto'],
    orderBy: { fechaAlta: 'DESC', id: 'DESC' },
    ...(limite !== undefined && { limit: limite }),
  });
};
*/
}
