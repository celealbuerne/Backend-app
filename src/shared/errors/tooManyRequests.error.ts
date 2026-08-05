import { AppError } from './appError.js';

export class TooManyRequests extends AppError {
  constructor(mensaje: string = 'Too many requests') {
    super(mensaje, 429);
  }
}
