 import {Request, Response, NextFunction} from 'express';
 import {PublicacionService} from './publicacion.service';
 import {BadRequestError} from '../shared/errors/badRequest.error.js';
 import {NotFoundIDError} from '../shared/errors/notFound.error.js';

 export class PublicacionController {
    constructor(private s: PublicacionService = new PublicacionService()) {} 
    
    findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const publicaciones = await this.s.findAll();
            res.status(200).json({
                mensaje: 'Listado publicaciones',
                data: publicaciones,
            });
        } catch (error) {
            next(error);
        }
    };

    getOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id) || id <= 0)
                throw new NotFoundIDError();
            const publicacion = await this.s.getOne(id);
            res.status(200).json({
                mensaje: 'Publicacion encontrada',
                data: publicacion,
            });
        } catch (error) {
            next(error);
        }
    };

    saveOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const input = req.body.sanitizedInput;
            const imagen = req.file!.filename;
            const nuevaPublicacion = await this.s.saveOne(input,imagen);
            res.status(201).json({
                mensaje: 'Publicacion creada exitosamente',
                data: nuevaPublicacion,
            });
        } catch (error) {
            next(error);
        }
    };

    updateOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id) || id <= 0)
                throw new NotFoundIDError();
            const input = req.body.sanitizedInput;
            const imagen = req.file?.filename;
            const publicacion = await this.s.updateOne(id, input, imagen);
            res.status(200).json({
                mensaje: 'Publicacion actualizada exitosamente',
                data: publicacion,
            });
        } catch (error) {
            next(error);
        }
    };

    removeOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id) || id <= 0)
                throw new NotFoundIDError();
            const publicacion = await this.s.removeOne(id);
            res.status(200).json({
                mensaje: 'Publicacion eliminada exitosamente',
                data: publicacion,
            });
        } catch (error) {
            next(error);
        }
    };

    findActivas = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const precioMax = req.query.precioMax ? Number(req.query.precioMax) : undefined;
            const precioMin = req.query.precioMin ? Number(req.query.precioMin) : undefined;
            const publicaciones = await this.s.findActivas(precioMax, precioMin);
            res.status(200).json({
                mensaje: 'Listado publicaciones activas',
                data: publicaciones,
            });
        } catch (error) {
            next(error);
        }
    };

    findMisPublicaciones = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const proveedorID = Number(req.params.proveedorID);
            if (isNaN(proveedorID) || proveedorID <= 0)
                throw new NotFoundIDError();
            const publicaciones = await this.s.findMisPublicaciones(proveedorID);
            res.status(200).json({
                mensaje: 'Listado mis publicaciones',
                data: publicaciones,
            });
        } catch (error) {
            next(error);
        }
    };
 }
