import { Request, Response, NextFunction } from 'express';
// para que no joda eslint
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.log('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'ERROR TERRIBLE';

  res.status(status).json({
    error: true,
    mensaje: message,
  });
}
