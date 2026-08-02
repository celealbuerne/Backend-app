import { Router } from 'express';
import { AeronaveController } from '../controllers/aeronave.controller.js';

const aeronaveRouter = Router();
const c = new AeronaveController();

// otros
aeronaveRouter.get('/buscar', c.findByUserInput);
aeronaveRouter.get('/proveedor/:id', c.getByOwner);
aeronaveRouter.get('/aeropuerto/:id', c.getByAirport);

// CRUD
aeronaveRouter.get('/', c.findAll);
aeronaveRouter.get('/:id', c.getOne);
aeronaveRouter.post('/', c.sanitizeInput, c.saveOne);
aeronaveRouter.put('/:id', c.sanitizeInput, c.updateOne);
aeronaveRouter.patch('/:id', c.sanitizeInput, c.updateOne);
aeronaveRouter.delete('/:id', c.removeOne);

export default aeronaveRouter;
