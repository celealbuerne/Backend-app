import { NextFunction, Request, Response } from 'express';
import { orm } from '../shared/orm.js';
import { Aeronave } from '../models/aeronave.entity.js';
import { Usuario } from '../models/usuario.entity.js';
import { NotFoundIDError } from '../errors/notFound.error.js';
import { BadRequestError } from '../errors/badRequest.error.js';

// const em = orm.em;
export class AeronaveController {
  sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
    const {
      modelo,
      fabricante,
      descripcion,
      capacidad,
      autonomia,
      velocidadMaxima,
      antiguedad,
      miProveedor,
    } = req.body;

    const sanitizedInput: Record<string, any> = {
      modelo: modelo ? String(modelo).trim() : undefined,
      fabricante: fabricante ? String(fabricante).trim() : undefined,
      descripcion: descripcion ? String(descripcion).trim() : undefined,
      capacidad: capacidad !== undefined ? Number(capacidad) : undefined,
      autonomia: autonomia !== undefined ? Number(autonomia) : undefined,
      velocidadMaxima: velocidadMaxima !== undefined ? Number(velocidadMaxima) : undefined,
      antiguedad: antiguedad ? new Date(antiguedad) : undefined,
      miProveedor: miProveedor !== undefined ? Number(miProveedor) : undefined,
    };
    // limpiar claves que hayan quedado undefined
    Object.keys(sanitizedInput).forEach((key) => {
      if (sanitizedInput[key] === undefined) {
        delete sanitizedInput[key];
      }
    });

    if (
      sanitizedInput.capacidad !== undefined &&
      (Number.isNaN(sanitizedInput.capacidad) || sanitizedInput.capacidad <= 0)
    ) {
      return res.status(400).json({ mensaje: 'la capacidad debe ser un número mayor a 0' });
    }
    if (sanitizedInput.antiguedad && isNaN(sanitizedInput.antiguedad.getTime())) {
      return res.status(400).json({ mensaje: 'La fecha de antigüedad no es una fecha válida' });
    }

    req.body.sanitizedInput = sanitizedInput;
    next();
  };

  findAll = async (req: Request, res: Response) => {
    // TODO: service
    const aeronaves = await orm.em.findAll(Aeronave);
    res.status(200).json({
      mensaje: 'todas las aeronaves',
      data: aeronaves,
    });
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: service
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        throw new NotFoundIDError();
      }

      const aeronave = await orm.em.findOneOrFail(Aeronave, { id }, { populate: ['miProveedor'] });

      res.status(200).json({ mensaje: 'la aeronave ' + id, data: aeronave });
    } catch (error) {
      next(error);
    }
  };

  saveOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO: service
      const input = req.body.sanitizedInput;
      const proveedor = await orm.em.findOne(Usuario, { id: input.miProveedor });

      if (!proveedor) {
        throw new BadRequestError('El proveedor ingresado no existe.');
      }
      // faltan más validaciones a implementar cuando se haga el service

      const nuevaAeronave = orm.em.create(Aeronave, req.body.sanitizedInput);
      await orm.em.flush();

      res.status(201).json({
        mensaje: 'aeronave creada exitosamente',
        data: nuevaAeronave,
      });
    } catch (error) {
      next(error);
    }
  };

  updateOne = async (req: Request, res: Response, next: NextFunction) => {
    //TODO: service
    try {
      const id = Number(req.params.id);

      const aeronave = await orm.em.findOneOrFail(Aeronave, { id });
      orm.em.assign(aeronave, req.body.sanitizedInput);
      await orm.em.flush();

      res.status(200).json({
        message: 'aeronave actualizada',
        data: aeronave,
      });
    } catch (error) {
      next(error);
    }
  };

  removeOne = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: service
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        throw new NotFoundIDError();
      }

      // esto obtiene la referencia sin cargar el objeto
      const aeronave = orm.em.getReference(Aeronave, id);
      orm.em.remove(aeronave);
      await orm.em.flush();

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
