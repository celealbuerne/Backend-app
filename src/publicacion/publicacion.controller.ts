import { Request, Response, NextFunction } from 'express';
import { PublicacionService } from './publicacion.service.js';
import { NotFoundIDError } from '../shared/errors/notFound.error.js';
import { BadRequestError } from '../shared/errors/badRequest.error.js';

export class PublicacionController {
  constructor(private s: PublicacionService = new PublicacionService()) {}

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filtros = res.locals.filtros;
      const publicaciones = await this.s.findAll(filtros);
      res.status(200).json({
        mensaje: 'Listado publicaciones',
        data: publicaciones,
      });
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id) || id <= 0) throw new NotFoundIDError();
      const publicacion = await this.s.getOne(id);
      res.status(200).json({
        mensaje: 'Publicacion encontrada',
        data: publicacion,
      });
    } catch (error) {
      next(error);
    }
  };

  saveOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.body.sanitizedInput;
      const imagen = `/uploads/publicaciones/${req.file!.filename}`;
      const proveedorID = Number(req.user.id);
      const nuevaPublicacion = await this.s.saveOne(input, imagen, proveedorID);
      res.status(201).json({
        mensaje: 'Publicacion creada exitosamente',
        data: nuevaPublicacion,
      });
    } catch (error) {
      next(error);
    }
  };

  updateOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id); //cambiar por user y revisar en el front
      if (!Number.isInteger(id) || id <= 0) throw new NotFoundIDError();
      const input = req.body.sanitizedInput;
      const imagen = req.file?.filename;
      const publicacion = await this.s.updateOne(id, input, imagen);
      res.status(200).json({
        mensaje: 'Publicacion actualizada exitosamente',
        data: publicacion,
      });
    } catch (error) {
      next(error);
    }
  };

  removeOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id); //cambiar por user y revisar en el front
      if (!Number.isInteger(id) || id <= 0) throw new NotFoundIDError();
      const publicacion = await this.s.removeOne(id);
      res.status(200).json({
        mensaje: 'Publicacion eliminada exitosamente',
        data: publicacion,
      });
    } catch (error) {
      next(error);
    }
  };

  findMisPublicaciones = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const proveedorID = Number(req.user.id);
      const filtros = res.locals.filtros;
      const publicaciones = await this.s.findMisPublicaciones(proveedorID, filtros);
      res.status(200).json({
        mensaje: 'Listado mis publicaciones',
        data: publicaciones,
      });
    } catch (error) {
      next(error);
    }
  };
  //se agrega para mostrar las recientes en el HomePage
  findByRecientes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.s.findByRecientes();
      res.status(200).json({ mensaje: 'Publicaciones recientes', data });
    } catch (error) {
      next(error);
    }
  };

  getDisponibilidad = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestError('El ID de la publicación ingresado no es válido.');
      }

      const fechasOcupadas = await this.s.getDisponibilidad(id);

      res.status(200).json({
        mensaje: 'Fechas ocupadas encontradas',
        data: fechasOcupadas,
      });
    } catch (error) {
      next(error);
    }
  };
}
