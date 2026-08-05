import { AppError } from './appError.js';

export class NotFoundIDError extends AppError {
  constructor(mensaje: string = 'El recurso solicitado no existe') {
    super(mensaje, 404);
  }
}
