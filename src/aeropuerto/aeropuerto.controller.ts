import {Request, Response, NextFunction} from 'express';
import {AeropuertoService} from './aeropuerto.service';
import {NotFoundIDError} from '../shared/errors/notFound.error.js';

export class AeropuertoController {
    constructor(private readonly s: AeropuertoService = new AeropuertoService()) {} 

    findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const aeropuertos = await this.s.findAll();
            res.status(200).json({
                mensaje: 'Todos los aeropuertos',
                data: aeropuertos,
            });
        } catch (error) {
            next(error);
        }
    };


    findOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);   
            if (Number.isNaN(id) || id <= 0) {
                throw new NotFoundIDError();
            }
            const aeropuerto = await this.s.getOne(id);
            res.status(200).json({
                mensaje: 'El aeropuerto ' + id,
                data: aeropuerto,
            });
        } catch (error) {
            next(error);
        }

    };

    saveOne = async (req: Request, res: Response, next: NextFunction) => {  
        try {
            const aeropuerto = await this.s.saveOne(req.body.sanitizedInput);
            res.status(201).json({
                mensaje: 'Aeropuerto creado exitosamente',
                data: aeropuerto,
            });
        } catch (error) {
            next(error);
        }
    };

    updateOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id) || id <= 0) {
                throw new NotFoundIDError();
            }
            const aeropuerto = await this.s.updateOne(id, req.body.sanitizedInput);
            res.status(200).json({
                mensaje: 'Aeropuerto actualizado exitosamente',
                data: aeropuerto,
            });
        } catch (error) {
            next(error);
        }
    };

    removeOne = async (req: Request, res: Response, next: NextFunction) => {    
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id) || id <= 0) {
                throw new NotFoundIDError();
            }
            const aeropuerto = await this.s.removeOne(id);
            res.status(200).json({
                mensaje: 'Aeropuerto eliminado exitosamente',
                data: aeropuerto,
            });
        } catch (error) {
            next(error);
        }
    };
}