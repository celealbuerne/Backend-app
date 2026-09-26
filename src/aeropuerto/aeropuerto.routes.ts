import { Router } from 'express';
import { AeropuertoController } from './aeropuerto.controller.js';
import * as md from './aeropuerto.middleware.js';
//import { verificarToken, verificarRol } from '../auth/auth.middleware.js';
//import { RolUsuario } from '../usuario/usuario.entity.js';

const aeropuertoRouter = Router();
const aeropuertoController = new AeropuertoController();

aeropuertoRouter.get('/', aeropuertoController.findAll);
aeropuertoRouter.get('/:id', aeropuertoController.findOne);
aeropuertoRouter.post(
  '/',
  /*verificarToken, verificarRol(RolUsuario.ADMIN)*/ md.sanitizeInput,
  md.validarCrearDatos,
  aeropuertoController.saveOne
);
aeropuertoRouter.put(
  '/:id',
  /*verificarToken, verificarRol(RolUsuario.ADMIN)*/ md.sanitizeInput,
  md.validarCrearDatos,
  aeropuertoController.updateOne
);
aeropuertoRouter.patch(
  '/:id',
  /*verificarToken, verificarRol(RolUsuario.ADMIN)*/ md.sanitizeInput,
  md.validarActualizarDatos,
  aeropuertoController.updateOne
);
aeropuertoRouter.delete(
  '/:id',
  /*verificarToken, verificarRol(RolUsuario.ADMIN)*/ aeropuertoController.removeOne
);

export default aeropuertoRouter;
