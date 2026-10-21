import { Reserva, EstadoReserva } from './reserva.entity.js';
import { CreateReservaDTO, updateEstadoReservaDTO } from './reserva.dto.js';
import { FilterReservaDTO } from './filterReserva.dto.js';
import { FilterQuery } from '@mikro-orm/core';
import { orm } from '../shared/db/orm.js';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { NotFoundIDError } from '../shared/errors/notFound.error.js';
import { ForbiddenError } from '../shared/errors/forbidden.error.js';
import { Publicacion } from '../publicacion/publicacion.entity.js';
import { Aeropuerto } from '../aeropuerto/aeropuerto.entity.js';
import { RolUsuario } from '../usuario/usuario.entity.js';

export class ReservaService {

  findAll = async (
    filtros: FilterReservaDTO,
    usuarioID: number,
    rol: RolUsuario
  ) => {
    const { estado, cliente, publicacion } = filtros;

    const where: FilterQuery<Reserva> = {};

    if (estado) where.estado = estado;
    if (cliente !== undefined) where.cliente = cliente;
    if (publicacion !== undefined) where.publicacion = publicacion;

    if (rol === RolUsuario.CLIENTE) {
      where.cliente = usuarioID;
  
    } else if (rol === RolUsuario.PROVEEDOR) {
      // filtra por proveedor a través de la publicación
      where.publicacion = { proveedor: usuarioID };
    }
 // ADMIN puede ver todo. no entra en los bloques anteriores
    const reservas = await orm.em.find(Reserva, where, {
      populate: [

        'origen',
        'destino',
        'cliente',
        'publicacion',
        'publicacion.aeronave',
        'publicacion.proveedor',
      ],
    });
    return reservas;
  };

  getOne = async (id: number, usuarioID: number) => {
    const reserva = await orm.em.findOne(
      Reserva,
      { id },
      {
        populate: [
          'origen',
          'destino',
          'cliente',
          'publicacion',
          'publicacion.aeronave',
          'publicacion.proveedor',
        ],
      }
    );
    if (!reserva) {
      throw new NotFoundIDError('La reserva ingresada no existe');
    }

    const esCliente = reserva.cliente.id === usuarioID;
    const esProveedor = reserva.publicacion.proveedor.id === usuarioID; 
    if (!esCliente && !esProveedor) {
      throw new ForbiddenError('No tenés permiso para ver esta reserva');
    }
    return reserva;
  };

  saveOne = async (input: CreateReservaDTO, clienteID: number) => {
    const publicacion = await orm.em.findOne(
      Publicacion,
      { id: input.publicacion },
      { populate: ['aeronave.ultimoAeropuerto', 'proveedor'] }
    );
    if (!publicacion) {
      throw new NotFoundIDError('La publicación ingresada no existe');
    }

    const destino = await orm.em.findOne(Aeropuerto, { id: input.destino });
    if (!destino) {
      throw new NotFoundIDError('El destino ingresado no existe');
    }

    const origen = publicacion.aeronave.ultimoAeropuerto;

    const montoTotal = 0; //  por definir

    const solapadas = await orm.em.count(Reserva, {
      publicacion: publicacion.id,
      estado: { $in: [EstadoReserva.CONFIRMADA, EstadoReserva.PENDIENTE] },
      fechaInicio: { $lte: input.fechaFin },
      fechaFin: { $gte: input.fechaInicio },
    });

    if (solapadas > 0) {
      throw new BadRequestError('No se puede reservar en esas fechas.');
    }

    const nuevaReserva = orm.em.create(Reserva, {
      origen,
      destino,
      montoTotal,
      estado: EstadoReserva.PENDIENTE,
      cliente: clienteID, 
      publicacion,
      fechaInicio: input.fechaInicio,
      fechaFin: input.fechaFin,
    });

    await orm.em.flush();
    return nuevaReserva;
  };
// revisar porque el cliente puede modificar reserva 
  updateEstado = async (id: number, input: updateEstadoReservaDTO, usuarioID: number) => {
    const reserva = await orm.em.findOne(
      Reserva,
      { id },
      { populate: ['publicacion.proveedor', 'origen', 'destino', 'cliente'] }
    );
    
    if (!reserva || reserva.publicacion.proveedor.id !== usuarioID) {
      throw new NotFoundIDError('La reserva ingresada no existe');
    }

    if (reserva.estado !== EstadoReserva.PENDIENTE) {
      throw new BadRequestError('Solo se puede modificar una reserva pendiente');
    }

    if (
      input.nuevoEstado !== EstadoReserva.CONFIRMADA &&
      input.nuevoEstado !== EstadoReserva.RECHAZADA
    ) {
      throw new BadRequestError('El proveedor solo puede confirmar o rechazar la reserva');
    }


    reserva.estado = input.nuevoEstado;
    await orm.em.flush();
    return reserva;
  };
}
//supongo que por el momento no vamos a usar REMOVE o por lo menos hasta que no tengamos lo de CANCELAR