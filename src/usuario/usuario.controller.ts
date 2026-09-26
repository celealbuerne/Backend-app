import { Request, Response, NextFunction } from 'express';
import { NotFoundIDError } from '../shared/errors/notFound.error.js';
import { UsuarioService } from './usuario.service.js';
import { BadRequestError } from '../shared/errors/badRequest.error.js';

export class UsuarioController {
  constructor(private readonly s: UsuarioService = new UsuarioService()) {}

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usuario = await this.s.findAll();
      res.status(200).json({
        mensaje: 'todos los usuarios',
        data: usuario,
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
      const usuario = await this.s.getOne(id);

      res.status(200).json({ mensaje: 'el usuario ' + id, data: usuario });
    } catch (error) {
      next(error);
    }
  };

  saveOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nuevoUsuario = await this.s.saveOne(req.body.sanitizedInput);

      res.status(201).json({
        mensaje: 'usuario creado exitosamente',
        data: nuevoUsuario,
      });
    } catch (error) {
      next(error);
    }
  };

  updateOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        throw new BadRequestError('El usuario ingresado no es válido.');
      }
      const usuarioActualizado = await this.s.updateOne(id, req.body.sanitizedInput);
      res.status(200).json({
        message: 'Usuario actualizado',
        data: usuarioActualizado,
      });
    } catch (error) {
      next(error);
    }
  };

  //Faltaba para eliminar un usuario
  removeOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        throw new BadRequestError('El usuario ingresado no es válido.');
      }
      await this.s.removeOne(id);
      res.status(200).json({
        message: 'Usuario eliminado',
      });
    } catch (error) {
      next(error);
    }
  };
}
