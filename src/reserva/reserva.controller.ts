import { Request, Response, NextFunction } from 'express';
import { ReservaService } from './reserva.service.js';
import { BadRequestError } from '../shared/errors/badRequest.error.js';


export class ReservaController {
  constructor(private s: ReservaService = new ReservaService()) {}

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filtros = res.locals.filtros ?? {};
      const reservas = await this.s.findAll(filtros, req.user.id, req.user.rol);
      res.status(200).json({
        mensaje: 'Reservas encontradas',
        data: reservas,
      });
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
          throw new BadRequestError('El ID de la reserva ingresado no es válido.');
        }
      const reserva = await this.s.getOne(id, req.user.id);
      res.status(200).json({
        mensaje: 'Reserva encontrada',
        data: reserva,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.body.sanitizedInput;
      const reserva = await this.s.saveOne(input, req.user.id);
      res.status(201).json({
        mensaje: 'Reserva creada',
        data: reserva,
      });
    } catch (error) {
      next(error);
    }
  };

  findFechasOcupadas = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const publicacionID = Number(req.params.publicacionID);
      if (!Number.isInteger(publicacionID) || publicacionID <= 0) {
        throw new BadRequestError('El ID de la publicación ingresado no es válido.');
      }

      const fechasOcupadas = await this.s.getDisponibilidad(publicacionID);
      
      res.status(200).json({
        mensaje: 'Fechas ocupadas encontradas',
        data: fechasOcupadas,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestError('El ID de la reserva ingresado no es válido.');
      }

      const input = req.body.sanitizedInput;

      const reserva = await this.s.updateEstado(id, input, req.user.id);
      res.status(200).json({
        mensaje: 'Reserva actualizada',
        data: reserva,
      });
    } catch (error) {
      next(error);
    }
  };
}