import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { CreateLocalidadDTO } from './createLocalidad.dto.js';

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  const { pais, provincia, nombre, codigoPostal } = req.body;

  const sanitizedInput: Record<string, any> = {
    //arma un nuevo objeto con los datos que vienen del req.body, pero ya limpiados y convertidos al tipo que queremos
    pais: pais ? String(pais).trim() : undefined,
    provincia: provincia ? String(provincia).trim() : undefined,
    nombre: nombre ? String(nombre).trim() : undefined,
    codigoPostal: codigoPostal !== undefined ? Number(codigoPostal) : undefined,
  };

  Object.keys(sanitizedInput).forEach((key) => {
    if (sanitizedInput[key] === undefined || sanitizedInput[key] === '') {
      delete sanitizedInput[key];
    }
  });

  if (sanitizedInput.codigoPostal !== undefined && Number.isNaN(sanitizedInput.codigoPostal)) {
    throw new BadRequestError('El código postal ingresado no es válido.');
  }

  req.body.sanitizedInput = sanitizedInput;
  next();
}

export function validarCrearDatos(req: Request, res: Response, next: NextFunction) {
  const input = req.body.sanitizedInput;

  const camposObligatorios: (keyof CreateLocalidadDTO)[] = [
    'pais',
    'provincia',
    'nombre',
    'codigoPostal',
  ];

  for (const campo of camposObligatorios) {
    if (input[campo] === undefined) {
      throw new BadRequestError('El campo ' + campo + ' es obligatorio.');
    }
  }

  next();
}

//para PATCH, valida que al menos haya un campo para actualizar
export function validarActualizarDatos(req: Request, res: Response, next: NextFunction) {
  const input = req.body.sanitizedInput;

  if (Object.keys(input).length === 0) {
    throw new BadRequestError('No se proporcionaron datos para actualizar.');
  }
  next();
}
