import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { RegisterDTO, LoginDTO } from '../auth/auth.dto.js';
import { RolUsuario } from '../usuario/usuario.entity.js';

//REVISAR
//SE ENCARGA DE REVISAR LOS DATOS DE REGISTRO Y LOGIN

const ROLES_PERMITIDOS_EN_REGISTRO = [RolUsuario.CLIENTE, RolUsuario.PROVEEDOR];

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/; //regex para validar fechas en formato ISO

export function sanitizedInput(req: Request, res: Response, next: NextFunction) {
  const { nombre, nombreUsuario, pais, fechaNacimiento, tipoDocumento, documento, contraseña, rol } = req.body;

  if (fechaNacimiento !== undefined && !ISO_DATE_REGEX.test(fechaNacimiento)) {
    throw new BadRequestError('El formato de fecha de nacimiento no es válido.');
  }

  const sanitizedInput: Record<string, any> = {
    nombre: nombre !== undefined ? String(nombre).trim() : undefined,
    nombreUsuario: nombreUsuario !== undefined ? String(nombreUsuario).trim() : undefined,
    pais: pais !== undefined ? String(pais).trim() : undefined,
    fechaNacimiento: fechaNacimiento !== undefined ? new Date(fechaNacimiento) : undefined,
    tipoDocumento: tipoDocumento !== undefined ? String(tipoDocumento).trim() : undefined,
    documento: documento !== undefined ? String(documento).trim() : undefined,
    contraseña: contraseña !== undefined ? String(contraseña) : undefined, // sin trim
    rol: rol !== undefined ? rol : undefined,
  };

  Object.keys(sanitizedInput).forEach((key) => {
    if (sanitizedInput[key] === undefined || sanitizedInput[key] === '') {
      delete sanitizedInput[key];
    }
  });

  if (sanitizedInput.fechaNacimiento !== undefined && isNaN(sanitizedInput.fechaNacimiento.getTime())) {
    throw new BadRequestError('La fecha de nacimiento no es válida.');
  }

  if (sanitizedInput.fechaNacimiento !== undefined && sanitizedInput.fechaNacimiento > new Date()) {
    throw new BadRequestError('La fecha de nacimiento no puede ser mayor a la fecha actual.');
  }

  if (sanitizedInput.rol !== undefined && !ROLES_PERMITIDOS_EN_REGISTRO.includes(sanitizedInput.rol)) {
    throw new BadRequestError('El rol ingresado no es válido.');
  }

  req.body.sanitizedInput = sanitizedInput;
  next();
}

export function validarRegister(req: Request, res: Response, next: NextFunction) {
  const data: RegisterDTO = req.body.sanitizedInput;

  const camposObligatorios: (keyof RegisterDTO)[] = [
    'nombre',
    'nombreUsuario',
    'pais',
    'fechaNacimiento',
    'tipoDocumento',
    'documento',
    'contraseña',
  ];

  camposObligatorios.forEach((campo) => {
    if (data[campo] === undefined) {
      throw new BadRequestError(`El campo ${campo} es obligatorio.`);
    }
  });

  if (data.contraseña.length < 6) {
    //revisar si es obligatorio
    throw new BadRequestError('La contraseña debe tener al menos 6 caracteres.');
  }

  if (/\s/.test(data.contraseña)) {
    throw new BadRequestError('La contraseña no puede contener espacios.');
  }

  next();
}

export function validarLogin(req: Request, res: Response, next: NextFunction) {
  const data: LoginDTO = req.body.sanitizedInput;

  if (data.nombreUsuario === undefined || data.contraseña === undefined) {
    throw new BadRequestError('Nombre de usuario y contraseña son obligatorios.');
  }

  next();
}
