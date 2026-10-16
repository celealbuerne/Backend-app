import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { CreatePublicacionDTO, UpdatePublicacionDTO } from './publicacion.dto.js';
import { FilterPublicacionDTO } from './filterPublicacion.dto.js';

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  const {
    descripcion,
    precioPorKM,
    aeronaveID,
  } = req.body;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitizedInput: Record<string, any> = {
    descripcion: descripcion !== undefined ? String(descripcion).trim() : undefined,
    precioPorKM: precioPorKM !== undefined ? Number(precioPorKM) : undefined,
    aeronaveID: aeronaveID !== undefined ? Number(aeronaveID) : undefined,
  };

  Object.keys(sanitizedInput).forEach((key) => {
    if (sanitizedInput[key] === undefined || sanitizedInput[key] === '') {
      delete sanitizedInput[key];
    }
  });

  if (
    sanitizedInput.precioPorKM !== undefined &&
    (Number.isNaN(sanitizedInput.precioPorKM) || sanitizedInput.precioPorKM < 1)
  ) {
    throw new BadRequestError('El valor del precio/KM ingresado no es válido.');
  }

  if (
    sanitizedInput.aeronaveID !== undefined &&
    (Number.isNaN(sanitizedInput.aeronaveID) || sanitizedInput.aeronaveID <= 0)
  ) {
    throw new BadRequestError('El ID de la aeronave ingresado no es válido.');
  }

  req.body.sanitizedInput = sanitizedInput;
  next();
}

export function validarCrearPublicacion(req: Request, res: Response, next: NextFunction) {
  const input = req.body.sanitizedInput;
  const camposObligatorios: (keyof CreatePublicacionDTO)[] = [
    'descripcion',
    'precioPorKM',
    'aeronaveID',
  ];

  camposObligatorios.forEach((campo) => {
    if (input[campo] === undefined) {
      throw new BadRequestError(`El campo ${campo} es obligatorio.`);
    }
  });
  //PARA LA IMAGEN
  if (!req.file) {
    throw new BadRequestError('La imagen es obligatoria.');
  }
  next();
}

export function validarActualizarDatos(req: Request, res: Response, next: NextFunction) {
  const input: UpdatePublicacionDTO = req.body.sanitizedInput;

  if (Object.keys(input).length === 0 && !req.file) {
    throw new BadRequestError('No se proporcionaron datos para actualizar.');
  }

  next();
}

export function sanitizeFiltros(req: Request, res: Response, next: NextFunction) {
  const { descripcion, precioMin, precioMax, proveedor } = req.query;

  const aNumero = (valor: unknown, nombre: string) => {
    if (valor === undefined || valor === '') return undefined;
    const n = Number(valor);
    if (!Number.isFinite(n) || n < 0) {
      throw new BadRequestError(`El valor de ${nombre} no es válido.`);
    }
    return n;
  };

  const min = aNumero(precioMin, 'precioMin');
  const max = aNumero(precioMax, 'precioMax');

  if (min !== undefined && max !== undefined && min > max) {
    throw new BadRequestError('El precio mínimo no puede ser mayor al máximo.');
  }

  let prov: number | undefined = undefined;
  if (proveedor !== undefined && proveedor !== '') {
    prov = Number(proveedor);
    if (!Number.isFinite(prov)) {
      throw new BadRequestError('El parámetro proveedor debe ser un ID numérico válido.');
    }
  }

  const filtros: FilterPublicacionDTO = {
    descripcion: descripcion ? String(descripcion).trim() : undefined,
    precioMin: min,
    precioMax: max,
    proveedor: prov,
  };

  Object.keys(filtros).forEach((key) => {
    if (filtros[key as keyof FilterPublicacionDTO] === undefined) {
      delete filtros[key as keyof FilterPublicacionDTO];
    }
  });

  res.locals.filtros = filtros;
  next();
}
