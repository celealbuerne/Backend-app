import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { CreateReservaDTO, updateEstadoReservaDTO } from './reserva.dto.js';
import { FilterReservaDTO } from './filterReserva.dto.js'; // ajustá si está en otro archivo
import { EstadoReserva } from './reserva.entity.js';

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  const { destino, publicacion, fechaInicio, fechaFin, nuevoEstado } = req.body;

  const sanitizedInput: Record<string, any> = {
    destino: destino !== undefined ? Number(destino) : undefined,
    publicacion: publicacion !== undefined ? Number(publicacion) : undefined,
    fechaInicio: fechaInicio !== undefined ? new Date(fechaInicio) : undefined,
    fechaFin: fechaFin !== undefined ? new Date(fechaFin) : undefined,
  };

  Object.keys(sanitizedInput).forEach((key) => {
    if (sanitizedInput[key] === undefined || sanitizedInput[key] === '') {
      delete sanitizedInput[key];
    }
  });

  if (
    sanitizedInput.destino !== undefined &&
    (!Number.isInteger(sanitizedInput.destino) || sanitizedInput.destino <= 0)
  ) {
    throw new BadRequestError('El ID del destino ingresado no es válido.');
  }

  if (
    sanitizedInput.publicacion !== undefined &&
    (!Number.isInteger(sanitizedInput.publicacion) || sanitizedInput.publicacion <= 0)
  ) {
    throw new BadRequestError('El ID de la publicación ingresado no es válido.');
  }

  if (
    sanitizedInput.fechaInicio !== undefined &&
    Number.isNaN(sanitizedInput.fechaInicio.getTime())
  ) {
    throw new BadRequestError('La fecha de inicio ingresada no es válida.');
  }

  if (sanitizedInput.fechaFin !== undefined && Number.isNaN(sanitizedInput.fechaFin.getTime())) {
    throw new BadRequestError('La fecha de fin ingresada no es válida.');
  }

  req.body.sanitizedInput = sanitizedInput;
  next();
}

export function validarCrearReserva(req: Request, res: Response, next: NextFunction) {
  const input = req.body.sanitizedInput;
  const camposObligatorios: (keyof CreateReservaDTO)[] = [
    'destino',
    'publicacion',
    'fechaInicio',
    'fechaFin',
  ];

  camposObligatorios.forEach((campo) => {
    if (input[campo] === undefined) {
      throw new BadRequestError(`El campo ${campo} es obligatorio.`);
    }
  });
  // verificar bien validaciones de fechas
  if (input.fechaInicio >= input.fechaFin) {
    throw new BadRequestError('La fecha de inicio debe ser anterior a la de fin.');
  }

  const hoyArgentina = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  const inicio = input.fechaInicio.toISOString().slice(0, 10);

  if (inicio < hoyArgentina) {
    throw new BadRequestError('La fecha de inicio no puede ser anterior a hoy.');
  }

  next();
}

export function sanitizeEstadoInput(req: Request, res: Response, next: NextFunction) {
  const { nuevoEstado } = req.body;

  const sanitizedInput: Record<string, any> = {
    nuevoEstado: nuevoEstado !== undefined ? String(nuevoEstado).trim().toUpperCase() : undefined,
  };

  Object.keys(sanitizedInput).forEach((key) => {
    if (sanitizedInput[key] === undefined || sanitizedInput[key] === '') {
      delete sanitizedInput[key];
    }
  });

  if (
    sanitizedInput.nuevoEstado !== undefined &&
    !Object.values(EstadoReserva).includes(sanitizedInput.nuevoEstado)
  ) {
    throw new BadRequestError('El estado ingresado no es válido.');
  }

  req.body.sanitizedInput = sanitizedInput;
  next();
}

export function validarActualizarEstado(req: Request, res: Response, next: NextFunction) {
  const input: updateEstadoReservaDTO = req.body.sanitizedInput;

  if (input.nuevoEstado === undefined) {
    throw new BadRequestError('El campo nuevoEstado es obligatorio.');
  }

  next();
}

export function sanitizeFiltros(req: Request, res: Response, next: NextFunction) {
  const { estado, cliente, publicacion } = req.query;

  const parseId = (valor: unknown, nombre: string) => {
    if (valor === undefined || valor === '') return undefined;
    const n = Number(valor);
    if (!Number.isInteger(n) || n <= 0) {
      throw new BadRequestError(`El valor de ${nombre} no es válido.`);
    }
    return n;
  };

  let est: EstadoReserva | undefined = undefined;
  if (estado !== undefined && estado !== '') {
    est = String(estado).trim().toUpperCase() as EstadoReserva;
    if (!Object.values(EstadoReserva).includes(est)) {
      throw new BadRequestError('El parámetro estado no es válido.');
    }
  }

  const filtros: FilterReservaDTO = {
    estado: est,
    cliente: parseId(cliente, 'cliente'),
    publicacion: parseId(publicacion, 'publicacion'),
  };

  Object.keys(filtros).forEach((key) => {
    if (filtros[key as keyof FilterReservaDTO] === undefined) {
      delete filtros[key as keyof FilterReservaDTO];
    }
  });

  res.locals.filtros = filtros;
  next();
}
