import { Router } from 'express';
import { AeropuertoController } from './aeropuerto.controller.js';
import * as md from './aeropuerto.middleware.js';

const aeropuertoRouter = Router();
const aeropuertoController = new AeropuertoController();

aeropuertoRouter.get('/', aeropuertoController.findAll);
aeropuertoRouter.get('/:id', aeropuertoController.findOne);
aeropuertoRouter.post('/', md.sanitizeInput, md.validarCrearDatos, aeropuertoController.saveOne);
aeropuertoRouter.put('/:id', md.sanitizeInput, md.validarCrearDatos, aeropuertoController.updateOne);
aeropuertoRouter.patch('/:id', md.sanitizeInput, md.validarActualizarDatos, aeropuertoController.updateOne);
aeropuertoRouter.delete('/:id', aeropuertoController.removeOne);

export default aeropuertoRouter;
