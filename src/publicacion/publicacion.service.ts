import { Publicacion } from './publicacion.entity.js';
import { orm } from '../shared/db/orm.js';
import { EntityData } from '@mikro-orm/core';
import { CreatePublicacionDTO, UpdatePublicacionDTO } from './publicacion.dto.js';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { Aeronave } from '../aeronave/aeronave.entity.js';
import { Reserva } from '../reserva/reserva.entity.js';
import { EstadoReserva } from '../reserva/reserva.entity.js';

const LIMITE_POR_DEFECTO = 4;

export class PublicacionService {
  //Con filtro por precio y ademas no se ven las q estan "vencidas" <--- Revisar si es util lo de "vencidas"
  findAll = async (precioMax?: number, precioMin?: number) => {
    const filtro: any = { fechaFinDisponibilidad: { $gte: new Date() } };
    if (precioMax !== undefined || precioMin !== undefined) {
      filtro.precioPorKM = {};

      if (precioMax !== undefined) {
        filtro.precioPorKM.$lte = precioMax;
      }
      if (precioMin !== undefined) {
        filtro.precioPorKM.$gte = precioMin;
      }
    }
    const publicaciones = await orm.em.find(Publicacion, filtro, { 
      populate: ['laAeronave.elAeropuerto']
      //orderBy: { fechaAlta: 'DESC' },  <--- podria ser para reemplazar lo de destacadas por recientes
    });
    return publicaciones;
  };

  getOne = async (id: number) => {
    const publicacion = await orm.em.findOneOrFail(
      Publicacion,
      { id },
      { populate: ['laAeronave.elAeropuerto'] }
    );
    return publicacion;
  };

  //va imagen: string pq el service guarda el nombre de la img
  //se modifico para que aca verifique si la aeronave ya tiene una publicacion asociada, antes estaba en middleware
  saveOne = async (input: CreatePublicacionDTO, imagen: string, proveedorID: number) => {
  const em = orm.em.fork();
  const aeronave = await em.findOne(
    Aeronave,
    { id: input.aeronaveID },
    { populate: ['miPublicacion'] }
  );

  if (!aeronave) {
    throw new BadRequestError('La aeronave ingresada no existe.');
  }

  if (aeronave.miProveedor.id !== proveedorID) {
    throw new BadRequestError('La aeronave no pertenece al proveedor.');
  }

  if (aeronave.miPublicacion) {
    throw new BadRequestError(
      'La aeronave ingresada ya tiene una publicación asociada.'
    );
  }

  const nuevaPublicacion = em.create(Publicacion, {
    fechaInicioDisponibilidad: input.fechaInicioDisponibilidad,
    fechaFinDisponibilidad: input.fechaFinDisponibilidad,
    descripcion: input.descripcion,
    precioPorKM: input.precioPorKM,
    imagen,
    laAeronave: aeronave,
  });

  await em.flush();
  return nuevaPublicacion;
};

  //-----REVISAR NO ESTA TERMINADA-----// no compara nada todavia

  updateOne = async (id: number, input: UpdatePublicacionDTO, imagen?: string) => {
    const publicacion = await orm.em.findOne(Publicacion, { id });
    if (!publicacion) throw new BadRequestError('La publicacion ingresada no existe');
    /* Si se modifican las fechas, verificamos que no haya
        // reservas activas que queden fuera del nuevo período */
    if (
      input.fechaInicioDisponibilidad !== undefined ||
      input.fechaFinDisponibilidad !== undefined
    ) {
      const nuevaFechaInicio =
        input.fechaInicioDisponibilidad ?? publicacion.fechaInicioDisponibilidad;

      const nuevaFechaFin = input.fechaFinDisponibilidad ?? publicacion.fechaFinDisponibilidad;

      const reservasActivas = await orm.em.find(Reserva, {
        laPublicacion: { id },
        estado: { $in: [EstadoReserva.CONFIRMADA, EstadoReserva.PENDIENTE] },
      });
    }

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
      laPublicacion: { id },
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
      { laAeronave: { miProveedor: proveedorID } },
      { populate: ['laAeronave.elAeropuerto'] }
    );
    return publicaciones;
  };

//----------------------------------------------------------------------------------//
// CLIENTE - busca en vez de destacadas las mas recientes, puse las 4 mas recientes pero revisar si queda bien con la pag
  findByRecientes = async () => {
    const publicaciones = await orm.em.find(Publicacion,
      {},
      { 
        populate: ['laAeronave', 'laAeronave.elAeropuerto'],
        orderBy: {fechaAlta: 'DESC', id: 'DESC'},
        limit: LIMITE_POR_DEFECTO,
      }
    );
    return publicaciones;
  };

}
