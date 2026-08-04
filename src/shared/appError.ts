export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(mensaje: string, _codigo: number) {
    super(mensaje);
    this.statusCode = _codigo;

    this.status = `${_codigo}`.startsWith('4') ? 'fail' : 'error';

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
