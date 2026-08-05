import { AppError } from './appError.js';

export class ConflictError extends AppError {
  constructor(mensaje: string = 'Petición no aceptada') {
    super(mensaje, 409);
  }
}
