import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AppError } from '../errors/appError.js';
import {
  NotFoundError as MikroNotFoundError,
  UniqueConstraintViolationException,
  NotNullConstraintViolationException,
  ForeignKeyConstraintViolationException,
} from '@mikro-orm/core';
/*
la idea es que este errorHandler maneje los errores de mikro-orm y express
el resto se traducen a AppError
*/
export default function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  console.log('Error:', err);

  // error de express
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      status: 'fail',
      message: 'El cuerpo de la petición contiene un JSON con formato inválido',
    });
    return;
  }

  // errores de mikro-orm (consultas bbdd)
  if (err instanceof MikroNotFoundError) {
    res.status(404).json({
      status: 'fail',
      message: 'El recurso solicitado no existe en la base de datos',
    });
    return;
  }

  if (err instanceof UniqueConstraintViolationException) {
    res.status(409).json({
      // 409 Conflict
      status: 'fail',
      message: 'Ya existe un registro con ese valor único (duplicado)',
    });
    return;
  }

  if (err instanceof NotNullConstraintViolationException) {
    res.status(400).json({
      // 400 Bad Request
      status: 'fail',
      message: 'Faltan campos obligatorios para la base de datos',
    });
    return;
  }

  if (err instanceof ForeignKeyConstraintViolationException) {
    res.status(400).json({
      status: 'fail',
      message: 'El recurso relacionado especificado no existe o está en uso',
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        status: 'fail',
        message: 'La imagen no puede superar los 5 MB',
      });
      return;
    }

    res.status(400).json({
      status: 'fail',
      message: 'Error al subir la imagen',
    });
    return;
  }

  // errores tipo AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

  console.error('ERROR TERRIBLE', err);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
  });
}
