import { AppError } from './appError.js';

export class UnauthorizedError extends AppError {
  constructor(mensaje: string = 'El cliente no está autenticado') {
    super(mensaje, 401);
  }
}
