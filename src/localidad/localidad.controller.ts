import { Request, Response, NextFunction } from 'express';
import { LocalidadService } from './localidad.service.js';
import { NotFoundIDError } from '../shared/errors/notFound.error.js';

export class LocalidadController {
  constructor(private readonly s: LocalidadService = new LocalidadService()) {} //crea nueva instancia de LocalidadService y se asigna a s

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const localidades = await this.s.findAll();
      res.status(200).json({
        mensaje: 'Todas las localidades',
        data: localidades,
      });
    } catch (error) {
      next(error);
    }
  };

  findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        throw new NotFoundIDError();
      }
      const localidad = await this.s.getOne(id);
      res.status(200).json({
        mensaje: 'La localidad ' + id,
        data: localidad,
      });
    } catch (error) {
      next(error);
    }
  };

  saveOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const localidad = await this.s.saveOne(req.body.sanitizedInput);
      res.status(201).json({
        mensaje: 'Localidad creada',
        data: localidad,
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
      const localidad = await this.s.updateOne(id, req.body.sanitizedInput);
      res.status(200).json({
        mensaje: 'Localidad actualizada',
        data: localidad,
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
      res.status(200).json({
        mensaje: 'Localidad eliminada',
      });
    } catch (error) {
      next(error);
    }
  };
}
