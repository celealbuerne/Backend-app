import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { CreateAeronaveDTO } from './createAeronave.dto.js';

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  const {
    modelo,
    fabricante,
    descripcion,
    capacidad,
    autonomia,
    velocidadMaxima,
    antiguedad,
    miProveedor,
  } = req.body;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitizedInput: Record<string, any> = {
    modelo: modelo ? String(modelo).trim() : undefined,
    fabricante: fabricante ? String(fabricante).trim() : undefined,
    descripcion: descripcion ? String(descripcion).trim() : undefined,
    capacidad: capacidad !== undefined ? Number(capacidad) : undefined,
    autonomia: autonomia !== undefined ? Number(autonomia) : undefined,
    velocidadMaxima: velocidadMaxima !== undefined ? Number(velocidadMaxima) : undefined,
    antiguedad: antiguedad ? new Date(antiguedad) : undefined,
    miProveedor: miProveedor !== undefined ? Number(miProveedor) : undefined,
  };
  // limpiar claves que hayan quedado undefined O VACIAS
  Object.keys(sanitizedInput).forEach((key) => {
    if (sanitizedInput[key] === undefined || sanitizedInput[key] === '') {
      delete sanitizedInput[key];
    }
  });

  if (
    sanitizedInput.capacidad !== undefined &&
    (Number.isNaN(sanitizedInput.capacidad) || sanitizedInput.capacidad <= 0)
  ) {
    throw new BadRequestError('La capacidad debe ser un número mayor a 0');
  }
  if (sanitizedInput.antiguedad && isNaN(sanitizedInput.antiguedad.getTime())) {
    throw new BadRequestError('La fecha de antigüedad no es una fecha válida');
  }

  req.body.sanitizedInput = sanitizedInput;
  next();
}

export function validarCrearDatos(req: Request, res: Response, next: NextFunction) {
  const input = req.body.sanitizedInput;

  const camposObligatorios: (keyof Omit<CreateAeronaveDTO, 'descripcion'>)[] = [
    'modelo',
    'fabricante',
    'capacidad',
    'autonomia',
    'velocidadMaxima',
    'antiguedad',
    'miProveedor',
  ];
  for (const campo of camposObligatorios) {
    if (input[campo] === undefined || input[campo] === null) {
      throw new BadRequestError('El campo ' + campo + ' es obligatorio.');
    }
  }
  next();
}

// SI NO SE MANDA NADA SE ACTUALIZA EXITOSAMENTE IGUAL, SI SE MANDA CUALQUIER OTRO CAMPO TAMBIEN
//FALTA VALIDAR ESO