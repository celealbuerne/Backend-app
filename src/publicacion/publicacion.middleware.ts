import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { CreatePublicacionDTO, UpdatePublicacionDTO } from './publicacion.dto.js';

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/; //regex para validar fechas en formato ISO

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  const {
    descripcion,
    precioPorKM,
    aeronaveID,
    fechaInicioDisponibilidad,
    fechaFinDisponibilidad,
  } = req.body;

  if (fechaInicioDisponibilidad !== undefined && !ISO_DATE_REGEX.test(fechaInicioDisponibilidad)) {
    throw new BadRequestError('El formato de fecha de inicio de disponibilidad no es válido.');
  }
  if (fechaFinDisponibilidad !== undefined && !ISO_DATE_REGEX.test(fechaFinDisponibilidad)) {
    throw new BadRequestError('El formato de fecha de fin de disponibilidad no es válido.');
  }

  const sanitizedInput: Record<string, any> = {
    descripcion: descripcion !== undefined ? String(descripcion).trim() : undefined,
    precioPorKM: precioPorKM !== undefined ? Number(precioPorKM) : undefined,
    aeronaveID: aeronaveID !== undefined ? Number(aeronaveID) : undefined,
    //habria que borrar esto de disponibilidad si no lo usamos
    fechaInicioDisponibilidad:
      fechaInicioDisponibilidad !== undefined ? new Date(fechaInicioDisponibilidad) : undefined,
    fechaFinDisponibilidad:
      fechaFinDisponibilidad !== undefined ? new Date(fechaFinDisponibilidad) : undefined,
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

  if (
    sanitizedInput.fechaInicioDisponibilidad !== undefined &&
    isNaN(sanitizedInput.fechaInicioDisponibilidad.getTime())
  ) {
    throw new BadRequestError('La fecha de inicio de disponibilidad no es válida.');
  }

  if (
    sanitizedInput.fechaFinDisponibilidad !== undefined &&
    isNaN(sanitizedInput.fechaFinDisponibilidad.getTime())
  ) {
    throw new BadRequestError('La fecha de fin de disponibilidad no es válida.');
  }

  if (
    sanitizedInput.fechaInicioDisponibilidad !== undefined &&
    sanitizedInput.fechaFinDisponibilidad !== undefined &&
    sanitizedInput.fechaInicioDisponibilidad >= sanitizedInput.fechaFinDisponibilidad
  ) {
    throw new BadRequestError('La fecha de inicio debe ser anterior a la fecha de fin.');
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
    'fechaInicioDisponibilidad',
    'fechaFinDisponibilidad',
  ];

  camposObligatorios.forEach((campo) => {
    if (input[campo] === undefined) {
      throw new BadRequestError(`El campo ${campo} es obligatorio.`);
    }
  });

  // Regla propia de la creacion: no tiene sentido publicar con disponibilidad que ya empezo en el pasado
  const hoy = new Date().toISOString().split('T')[0]; // AAAA-MM-DD
  const inicio = input.fechaInicioDisponibilidad.toISOString().slice(0, 10);
  if (inicio < hoy) {
    throw new BadRequestError('La fecha de inicio de disponibilidad no puede ser anterior a hoy.');
  }
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
