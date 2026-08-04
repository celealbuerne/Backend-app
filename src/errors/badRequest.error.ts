import { AppError } from '../shared/appError.js';

export class BadRequestError extends AppError {
  constructor(mensaje: string = 'La petición es inválida') {
    super(mensaje, 400);
  }
}
