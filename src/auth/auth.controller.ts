import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { UnauthorizedError } from '../shared/errors/unauthorized.error.js';
import { JwtPayload } from './jwtPayload.interface.js';

export class AuthController {
  constructor(private s: AuthService = new AuthService()) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.body.sanitizedInput;
      const nuevoUsuario = await this.s.register(input);
      res.status(201).json({
        mensaje: 'Usuario registrado exitosamente',
        data: nuevoUsuario,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.body.sanitizedInput;
      const { token, usuario } = await this.s.login(input);
      res.status(200).json({
        mensaje: 'Login exitoso',
        data: { token, usuario },
      });
    } catch (error) {
      next(error);
    }
  };
}
