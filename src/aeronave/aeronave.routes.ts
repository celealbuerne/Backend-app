import { Router } from 'express';
import { AeronaveController } from './aeronave.controller.js';
import * as md from './aeronave.middleware.js';

const aeronaveRouter = Router();
const c = new AeronaveController();

// otros
aeronaveRouter.get('/buscar', c.findByUserInput);
aeronaveRouter.get('/proveedor/:id', c.getByOwner);
aeronaveRouter.get('/aeropuerto/:id', c.getByAirport);

// CRUD
aeronaveRouter.get('/', c.findAll);
aeronaveRouter.get('/:id', c.getOne);
aeronaveRouter.post('/', md.sanitizeInput, md.validarCrearDatos, c.saveOne);
aeronaveRouter.put('/:id', md.sanitizeInput, md.validarCrearDatos, c.updateOne);
aeronaveRouter.patch('/:id', md.sanitizeInput, c.updateOne);
aeronaveRouter.delete('/:id', c.removeOne);

export default aeronaveRouter;
