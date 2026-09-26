import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../shared/errors/unauthorized.error.js';
import { JwtPayload } from './jwtPayload.interface.js';
import { JWT_SECRET } from '../shared/config/jwt.config.js';
import { ForbiddenError } from '../shared/errors/forbidden.error.js';
import { RolUsuario } from '../usuario/usuario.entity.js';

//SOLO SE ENCARGA DE VERIFICAR EL TOKEN Y LOS ROLES, autenticación/autorización.

export interface AuthenticatedRequest extends Request {
  user: JwtPayload; //AuthenticatedRequest tiene todo lo que tiene un Request normal, más lo de jwt el user(id roles)
}

export function verificarToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization; //busca en los headers de la peticion HTTP el campo Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //si no existe o no empieza con Bearer
    throw new UnauthorizedError('Token no proporcionado o inválido');
  }

  const token = authHeader.split(' ')[1]; //obtiene el token limpio (sin el Bearer), la cadena de texto del JWT
  try {
    const userData = jwt.verify(token, JWT_SECRET) as JwtPayload; //verifica el token con la clave secreta yverifica que no haya expirado
    req.user = userData; //esos datos se guardan temporalmente en req.user para que las siguientes funciones sepan qué usuario está haciendo la petición
    next();
  } catch (error) {
    throw new UnauthorizedError('Token inválido o expirado');
  }
}

export function verificarRol(...rolesPermitidos: RolUsuario[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }

    const tieneRol = req.user.roles.some((rol) => rolesPermitidos.includes(rol));
    if (!tieneRol) {
      throw new ForbiddenError('No tienes permisos para acceder a este recurso');
    }

    next();
  };
}
