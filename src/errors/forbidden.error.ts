import { AppError } from '../shared/appError.js';

export class ForbiddenError extends AppError {
  constructor(mensaje: string = 'Cliente no autorizada a acceder al contenido') {
    super(mensaje, 403);
  }
}
