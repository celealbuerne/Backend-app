import { Publicacion } from './publicacion.entity.js';
import { orm } from '../shared/db/orm.js';
import { EntityData, FilterQuery } from '@mikro-orm/core';
import { CreatePublicacionDTO, UpdatePublicacionDTO } from './publicacion.dto.js';
import { FilterPublicacionDTO } from './filterPublicacion.dto.js';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { NotFoundIDError } from '../shared/errors/notFound.error.js';
import { Aeronave } from '../aeronave/aeronave.entity.js';
import { Reserva, EstadoReserva } from '../reserva/reserva.entity.js';

// const LIMITE_POR_DEFECTO = 10;

export class PublicacionService {
  constructor(private LIMITE_POR_DEFECTO: number = 10) {}

  findAll = async (filtros?: FilterPublicacionDTO) => {
    const where: FilterQuery<Publicacion> = {};

    if (filtros?.descripcion) {
      where.descripcion = { $like: `%${filtros.descripcion}%` };
    }

    if (filtros?.precioMin !== undefined || filtros?.precioMax !== undefined) {
      where.precioPorDia = {};
      if (filtros.precioMin !== undefined) where.precioPorDia.$gte = filtros.precioMin;
      if (filtros.precioMax !== undefined) where.precioPorDia.$lte = filtros.precioMax;
    }

    if (filtros?.proveedor !== undefined) {
      where.proveedor = filtros.proveedor;
    }

    return await orm.em.find(Publicacion, where, {
      populate: ['aeronave.ultimoAeropuerto', 'proveedor'],
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
      descripcion: input.descripcion,
      precioPorDia: input.precioPorDia,
      imagen,
      aeronave: aeronave, // la entidad completa? dudoso pero funciona
      proveedor: proveedorID,
    });

    await orm.em.flush();
    return nuevaPublicacion;
  };

  updateOne = async (id: number, input: UpdatePublicacionDTO, imagen?: string) => {
    const publicacion = await orm.em.findOne(Publicacion, { id });
    if (!publicacion) throw new BadRequestError('La publicacion ingresada no existe');

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
  // publicaciones del proveedor
  findMisPublicaciones = async (
    proveedorID: number,
    filtros?: Omit<FilterPublicacionDTO, 'proveedor'>
  ) => {
    return await this.findAll({ ...filtros, proveedor: proveedorID });
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

  getDisponibilidad = async (publicacionID: number) => {
    const publicacion = await orm.em.findOne(Publicacion, { id: publicacionID });
    if (!publicacion) {
      throw new NotFoundIDError('La publicación ingresada no existe');
    }

    const reservasOcupadas = await orm.em.find(
      Reserva,
      {
        publicacion: publicacionID,
        estado: { $in: [EstadoReserva.CONFIRMADA, EstadoReserva.PENDIENTE] },
        fechaFin: { $gte: new Date() }, // ignora las que ya terminaron
      },
      {
        fields: ['fechaInicio', 'fechaFin'],
        orderBy: { fechaInicio: 'ASC' }, // desde la más antigua hasta la más reciente
      }
    );

    return reservasOcupadas.map((r) => ({
      fechaInicio: r.fechaInicio,
      fechaFin: r.fechaFin,
    }));
  };
}
