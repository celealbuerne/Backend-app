import { Router } from 'express';
import { LocalidadController } from './localidad.controller.js';
import * as md from './localidad.middleware.js';

const localidadRouter = Router();

const localidadController = new LocalidadController();

localidadRouter.get('/', localidadController.findAll);
localidadRouter.get('/:id', localidadController.findOne);
localidadRouter.post('/', md.sanitizeInput, md.validarCrearDatos, localidadController.saveOne);
localidadRouter.put('/:id', md.sanitizeInput, md.validarCrearDatos, localidadController.updateOne);
localidadRouter.patch('/:id', md.sanitizeInput, md.validarActualizarDatos, localidadController.updateOne);
localidadRouter.delete('/:id', localidadController.removeOne);

export default localidadRouter;
