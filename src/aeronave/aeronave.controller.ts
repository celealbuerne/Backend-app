import { NextFunction, Request, Response } from 'express';
import { NotFoundIDError } from '../shared/errors/notFound.error.js';
import { AeronaveService } from './aeronave.service.js';

export class AeronaveController {
  constructor(private readonly s: AeronaveService = new AeronaveService()) {}

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const aeronaves = await this.s.findAll();
      res.status(200).json({
        mensaje: 'todas las aeronaves',
        data: aeronaves,
      });
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        throw new NotFoundIDError();
      }
      const aeronave = await this.s.getOne(id);

      res.status(200).json({ mensaje: 'la aeronave ' + id, data: aeronave });
    } catch (error) {
      next(error);
    }
  };

  saveOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nuevaAeronave = await this.s.saveOne(req.body.sanitizedInput);

      res.status(201).json({
        mensaje: 'aeronave creada exitosamente',
        data: nuevaAeronave,
      });
    } catch (error) {
      next(error);
    }
  };

  updateOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        throw new NotFoundIDError();
      }

      const aeronave = await this.s.updateOne(id, req.body.sanitizedInput);

      res.status(200).json({
        message: 'aeronave actualizada',
        data: aeronave,
      });
    } catch (error) {
      next(error);
    }
  };

  removeOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        throw new NotFoundIDError();
      }

      await this.s.removeOne(id);

      res.status(200).json({ mensaje: 'la aeronave ha sido eliminada correctamente' });
    } catch (error) {
      next(error);
    }
  };

  findByUserInput = async (req: Request, res: Response) => {
    throw new Error('en construccion');
  };

  getByOwner = async (req: Request, res: Response) => {
    throw new Error('en construccion');
  };

  findAgetByAirportll = async (req: Request, res: Response) => {
    throw new Error('en construccion');
  };

  getByAirport = async (req: Request, res: Response) => {
    throw new Error('en construccion');
  };
}
