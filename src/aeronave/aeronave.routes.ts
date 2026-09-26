import { Router } from 'express';
import { AeronaveController } from './aeronave.controller.js';
import * as md from './aeronave.middleware.js';
import { verificarToken, verificarRol } from '../auth/auth.middleware.js';
import { RolUsuario } from '../usuario/usuario.entity.js';

const aeronaveRouter = Router();
const c = new AeronaveController();

// otros

aeronaveRouter.get('/proveedor/:id', c.getByOwner);
aeronaveRouter.get('/aeropuerto/:id', c.getByAirport);

// CRUD
aeronaveRouter.get('/', c.findAll);
aeronaveRouter.get('/:id', c.getOne);
aeronaveRouter.post(
  '/',
  verificarToken,
  verificarRol(RolUsuario.PROVEEDOR),
  md.sanitizeInput,
  md.validarCrearDatos,
  c.saveOne
);
aeronaveRouter.put(
  '/:id',
  verificarToken,
  verificarRol(RolUsuario.PROVEEDOR),
  md.sanitizeInput,
  md.validarCrearDatos,
  c.updateOne
);
aeronaveRouter.patch(
  '/:id',
  verificarToken,
  verificarRol(RolUsuario.PROVEEDOR),
  md.sanitizeInput,
  c.updateOne
);
aeronaveRouter.delete('/:id', verificarToken, verificarRol(RolUsuario.PROVEEDOR), c.removeOne);

export default aeronaveRouter;
