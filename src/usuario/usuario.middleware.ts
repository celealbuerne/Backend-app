import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { isDate } from 'util/types';
import { CreateUsuarioDTO } from './createUsuario.dto.js';

export function sanitizeInput(req: Request, res: Response, next: NextFunction){
    const {
        estado,
        nombre,
        contacto,
        pais,
        fechaNacimiento,
        tipoDocumento,
        documento
    } = req.body;
    // eslint-disable-next-line no-useless-assignment
    let sc: string[] | undefined = undefined;
    if (Array.isArray(contacto)){
        sc = contacto
                .map((c) => String(c).trim())
                .filter((c) => c.length > 0) // quita vacios
    }
    else{
        throw new BadRequestError('Los contactos ingresados no son validos o contienen información no admitida.')
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitizedInput: Record<string, any> = {
        estado: estado ? String(estado).trim() : undefined, //
        nombre: nombre ? String(nombre).trim() : undefined,
        contacto: sc,
        pais: pais ? pais : undefined,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
        tipoDocumento: tipoDocumento ? tipoDocumento : undefined,
        documento: documento ? Number(documento) : undefined
    };
    Object.keys(sanitizedInput).forEach((key) => {
        if (sanitizedInput[key] === undefined){
            delete sanitizedInput[key];
        }
    })
    if ((sanitizedInput.fechaNacimiento !== undefined) && !isDate(sanitizedInput.fechaNacimiento)){
        throw new BadRequestError('La fecha de nacimiento ingresada no es válida.')
    }
    if ((sanitizedInput.documento !== undefined) && Number.isNaN(sanitizedInput.documento)){
        throw new BadRequestError('El documento ingresado no es válido.')
    }
    req.body.sanitizedInput = sanitizedInput;
    next();
}

export function validarCrearDatos(req: Request, res: Response, next: NextFunction){
    const input = req.body.sanitizedInput;

    const camposObligatorios: (keyof Omit<CreateUsuarioDTO, 'contacto'>)[] = [
        'nombre',
        'pais',
        'tipoDocumento',
        'documento',
        'fechaNacimiento'
    ];
    for (const campo of camposObligatorios){
        if (input[campo] === undefined){
            throw new BadRequestError('El campo ' + campo + ' es obligatorio.')
        }
    }
    next();
}