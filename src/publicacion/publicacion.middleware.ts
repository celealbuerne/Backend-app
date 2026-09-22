import {Request, Response, NextFunction} from 'express';
import {BadRequestError} from '../shared/errors/badRequest.error.js';
import {CreatePublicacionDTO, UpdatePublicacionDTO} from './publicacion.dto.js';

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
    const {estado, precioPorKM, fechaInicio, fechaFin, laAeronave} = req.body;

    const sanitizedInput: Record<string, any> = {
        //estado: estado ? String(estado).trim() : undefined,
        descripcion: descripcion !== undefined ? String(descripcion).trim() : undefined,
        precioPorKM: precioPorKM !== undefined ? Number(precioPorKM) : undefined,
        aeronaveID: laAeronave !== undefined ? Number(laAeronave) : undefined,
    };

    Object.keys(sanitizedInput).forEach((key) => {
        if (sanitizedInput[key] === undefined || sanitizedInput[key] === '') {
            delete sanitizedInput[key];
        }
    });

    if (sanitizedInput.precioPorKM !== undefined && (Number.isNaN(sanitizedInput.precioPorKM) || sanitizedInput.precioPorKM <= 0)) {
        throw new BadRequestError('El valor del precio/KM ingresado no es válido.');
    }

    if (sanitizedInput.aeronaveID !== undefined && Number.isNaN(sanitizedInput.aeronaveID)) {
        throw new BadRequestError('El ID de la aeronave ingresado no es válido.');
    }
    
    req.body.sanitizedInput =  sanitizedInput ;
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
        if (!input[campo]) {
            throw new BadRequestError(`El campo ${campo} es obligatorio.`);
        }
    });
//PARA LA IMAGEN
    if (!req.file) {
        throw new BadRequestError('La imagen es obligatoria.');
    }
    
    next();
};

export function validarActualizarDatos(req: Request, res: Response, next: NextFunction) {
    const input = req.body.sanitizedInput;

    if (Object.keys(input).length === 0 && !req.file){ 
        throw new BadRequestError(
            'No se proporcionaron datos para actualizar.'
        );
    }

    next();
}



