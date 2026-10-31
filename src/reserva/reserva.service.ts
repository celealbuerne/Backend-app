import { Reserva, EstadoReserva } from './reserva.entity.js';
import { CreateReservaDTO, updateEstadoReservaDTO } from './reserva.dto.js';
import { FilterReservaDTO } from './filterReserva.dto.js';
import { FilterQuery } from '@mikro-orm/core';
import { orm } from '../shared/db/orm.js';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { NotFoundIDError } from '../shared/errors/notFound.error.js';
import { ForbiddenError } from '../shared/errors/forbidden.error.js';
import { PublicacionService } from '../publicacion/publicacion.service.js';
import { AeropuertoService } from '../aeropuerto/aeropuerto.service.js';
import { RolUsuario } from '../usuario/usuario.entity.js';

export class ReservaService {
  constructor(
    private publicacionService: PublicacionService = new PublicacionService(),
    private aeropuertoService: AeropuertoService = new AeropuertoService()
  ) {}
  findAll = async (filtros: FilterReservaDTO, usuarioID: number, rol: RolUsuario) => {
    const { estado, cliente, publicacion } = filtros;
    //sacaria cliente de filtros
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

  private calcularMontoTotal = (
    precioPorDia: number,
    fechaInicio: Date,
    fechaFin: Date
  ): number => {
    const MS_POR_DIA = 1000 * 60 * 60 * 24;
    const cantidadDeDias =
      Math.round((fechaFin.getTime() - fechaInicio.getTime()) / MS_POR_DIA) + 1;
    return cantidadDeDias * Number(precioPorDia);
  };

  saveOne = async (input: CreateReservaDTO, clienteID: number) => {
    const publicacion = await this.publicacionService.getOne(input.publicacion);
    const destino = await this.aeropuertoService.getOne(input.destino);

    await this.publicacionService.verificarDisponibilidad(
      publicacion.id,
      input.fechaInicio,
      input.fechaFin
    );

    const origen = publicacion.aeronave.ultimoAeropuerto;
    const montoTotal = this.calcularMontoTotal(
      publicacion.precioPorDia,
      input.fechaInicio,
      input.fechaFin
    );

    const nuevaReserva = orm.em.create(Reserva, {
      origen: origen,
      destino: destino,
      montoTotal: montoTotal,
      estado: EstadoReserva.PENDIENTE,
      cliente: clienteID,
      publicacion: publicacion,
      fechaInicio: input.fechaInicio,
      fechaFin: input.fechaFin,
    });

    await orm.em.flush();
    return nuevaReserva;
  };

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
