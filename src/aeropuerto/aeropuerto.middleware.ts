import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { CreateAeropuertoDTO } from './createAeropuerto.dto.js';
import { FilterAeropuertoDTO } from './filterAeropuerto.dto.js';

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  const { nombre, codigo, localidadID } = req.body;

  const sanitizedInput: Record<string, any> = {
    //arma un nuevo objeto con los datos que vienen del req.body, pero ya limpiados y convertidos al tipo que queremos
    nombre: nombre ? String(nombre).trim() : undefined,
    codigo: codigo ? String(codigo).trim() : undefined,
    localidadID: localidadID ? Number(localidadID) : undefined,
  };

  //para limpiar claves que hayan quedado undefined o VACIAS
  Object.keys(sanitizedInput).forEach((key) => {
    if (sanitizedInput[key] === undefined || sanitizedInput[key] === '') {
      delete sanitizedInput[key];
    }
  });
  //si ponia nan cubria q no fuera letras, pero no q no sea negativo o 0
  if (
    sanitizedInput.localidadID !== undefined &&
    (!Number.isInteger(sanitizedInput.localidadID) || sanitizedInput.localidadID <= 0)
  ) {
    throw new BadRequestError('El ID de localidad ingresado no es válido.');
  }

  req.body.sanitizedInput = sanitizedInput;
  next();
}

export function validarCrearDatos(req: Request, res: Response, next: NextFunction) {
  const input = req.body.sanitizedInput;

  const camposObligatorios: (keyof CreateAeropuertoDTO)[] = ['nombre', 'codigo', 'localidadID'];

  camposObligatorios.forEach((campo) => {
    if (input[campo] === undefined) {
      throw new BadRequestError('El campo ' + campo + ' es obligatorio.');
    }
  });

  next();
}

export function validarActualizarDatos(req: Request, res: Response, next: NextFunction) {
  const input = req.body.sanitizedInput;

  if (Object.keys(input).length === 0) {
    throw new BadRequestError('No se proporcionaron datos para actualizar.');
  }
  next();
}

export function sanitizeFiltros(req: Request, res: Response, next: NextFunction) {
  const { nombre, codigo, localidadID, localidadNombre, localidad } = req.query;

  let locId: number | undefined = undefined;
  if (localidadID !== undefined && localidadID !== '') {
    locId = Number(localidadID);
    if (!Number.isInteger(locId) || locId <= 0) {
      throw new BadRequestError('El ID de localidad ingresado no es válido.');
    }
  }

  const rawLocNombre = localidadNombre !== undefined ? localidadNombre : localidad;

  const filtros: FilterAeropuertoDTO = {
    nombre: nombre ? String(nombre).trim() : undefined,
    codigo: codigo ? String(codigo).trim() : undefined,
    localidadID: locId,
    localidadNombre: rawLocNombre ? String(rawLocNombre).trim() : undefined,
  };

  Object.keys(filtros).forEach((key) => {
    if (
      filtros[key as keyof FilterAeropuertoDTO] === undefined ||
      filtros[key as keyof FilterAeropuertoDTO] === ''
    ) {
      delete filtros[key as keyof FilterAeropuertoDTO];
    }
  });

  res.locals.filtros = filtros;
  next();
}
