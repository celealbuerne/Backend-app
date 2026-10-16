import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { CreateAeronaveDTO } from './createAeronave.dto.js';
import { FilterAeronaveDTO } from './filterAeronave.dto.js';

// SI NO SE MANDA NADA SE ACTUALIZA EXITOSAMENTE IGUAL, SI SE MANDA CUALQUIER OTRO CAMPO TAMBIEN
//FALTA VALIDAR ESO

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  const {
    modelo,
    fabricante,
    descripcion,
    capacidad,
    autonomia,
    velocidadMaxima,
    antiguedad,
    proveedor,
    ultimoAeropuerto,
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
    proveedor: proveedor !== undefined ? Number(proveedor) : undefined,
    ultimoAeropuerto: ultimoAeropuerto !== undefined ? Number(ultimoAeropuerto) : undefined,
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
    'proveedor',
    'ultimoAeropuerto',
  ];
  for (const campo of camposObligatorios) {
    if (input[campo] === undefined || input[campo] === null) {
      throw new BadRequestError('El campo ' + campo + ' es obligatorio.');
    }
  }
  next();
}
// ``
export function sanitizeFiltros(req: Request, res: Response, next: NextFunction) {
  const { modelo, fabricante, capacidad, capacidadMin, capacidadMax, proveedor } = req.query;

  const aNumero = (valor: unknown, nombre: string) => {
    if (valor === undefined || valor === '') return undefined;
    const n = Number(valor);
    if (!Number.isFinite(n) || n <= 0) {
      throw new BadRequestError(`El valor de ${nombre} debe ser un número válido mayor a 0.`);
    }
    return n;
  };

  const cap = aNumero(capacidad, 'capacidad');
  const capMin = aNumero(capacidadMin, 'capacidadMin');
  const capMax = aNumero(capacidadMax, 'capacidadMax');

  if (capMin !== undefined && capMax !== undefined && capMin > capMax) {
    throw new BadRequestError('La capacidad mínima no puede ser mayor a la capacidad máxima.');
  }

  let prov: number | undefined = undefined;
  if (proveedor !== undefined && proveedor !== '') {
    prov = Number(proveedor);
    if (!Number.isFinite(prov) || Number.isNaN(prov)) {
      throw new BadRequestError('La ID de proveedor debe ser un número válido.');
    }
  }

  const filtros: FilterAeronaveDTO = {
    modelo: modelo ? String(modelo).trim() : undefined,
    fabricante: fabricante ? String(fabricante).trim() : undefined,
    capacidad: cap,
    capacidadMin: capMin,
    capacidadMax: capMax,
    proveedor: prov,
  };

  Object.keys(filtros).forEach((key) => {
    if (filtros[key as keyof FilterAeronaveDTO] === undefined) {
      delete filtros[key as keyof FilterAeronaveDTO];
    }
  });

  res.locals.filtros = filtros;
  next();
}
