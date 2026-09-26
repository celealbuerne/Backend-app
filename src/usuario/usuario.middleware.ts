import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { isDate } from 'util/types';
import { CreateUsuarioDTO } from './createUsuario.dto.js';
import { UnauthorizedError } from '../shared/errors/unauthorized.error.js';
import { ForbiddenError } from '../shared/errors/forbidden.error.js';
import { RolUsuario } from './usuario.entity.js';

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  const { estado, nombre, contacto, pais, fechaNacimiento, tipoDocumento, documento } = req.body;

  let sc: string[] | undefined = undefined;
  if (Array.isArray(contacto)) {
    sc = contacto.map((c) => String(c).trim()).filter((c) => c.length > 0); // quita vacios
  } else if (contacto !== undefined) {
    throw new BadRequestError(
      'Los contactos ingresados no son validos o contienen información no admitida.'
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitizedInput: Record<string, any> = {
    estado: estado ? String(estado).trim() : undefined, //
    nombre: nombre ? String(nombre).trim() : undefined,
    contacto: sc,
    pais: pais ? pais : undefined,
    fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
    tipoDocumento: tipoDocumento ? tipoDocumento : undefined,
    documento: documento ? Number(documento) : undefined,
  };
  Object.keys(sanitizedInput).forEach((key) => {
    if (sanitizedInput[key] === undefined || sanitizedInput[key] === '') {
      delete sanitizedInput[key];
    }
  });
  if (sanitizedInput.fechaNacimiento !== undefined && !isDate(sanitizedInput.fechaNacimiento)) {
    throw new BadRequestError('La fecha de nacimiento ingresada no es válida.');
  }
  if (sanitizedInput.documento !== undefined && Number.isNaN(sanitizedInput.documento)) {
    throw new BadRequestError('El documento ingresado no es válido.');
  }
  req.body.sanitizedInput = sanitizedInput;
  next();
}

export function validarCrearDatos(req: Request, res: Response, next: NextFunction) {
  const input = req.body.sanitizedInput;

  const camposObligatorios: (keyof Omit<CreateUsuarioDTO, 'contacto'>)[] = [
    'nombre',
    'pais',
    'tipoDocumento',
    'documento',
    'fechaNacimiento',
  ];
  for (const campo of camposObligatorios) {
    if (input[campo] === undefined) {
      throw new BadRequestError('El campo ' + campo + ' es obligatorio.');
    }
  }
  next();
}

export function esDueñoOAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    throw new UnauthorizedError('Usuario no autenticado');
  }

  const esDueño = req.user.id === Number(req.params.id); //quien hace la peticion → req.user.Que usuario quiere modificar/ver → req.params.id
  const esAdmin = req.user.roles.includes(RolUsuario.ADMIN);

  if (!esDueño && !esAdmin) {
    throw new ForbiddenError('No podés acceder a datos de otro usuario');
  }

  next();
}
