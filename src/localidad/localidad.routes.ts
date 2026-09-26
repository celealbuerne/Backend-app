import { Router } from 'express';
import { LocalidadController } from './localidad.controller.js';
import * as md from './localidad.middleware.js';
//import { verificarToken, verificarRol } from '../auth/auth.middleware.js';
//import { RolUsuario } from '../usuario/usuario.entity.js';

//LO QUE ESTA COMENTADO ES PARA CUANDO CREEMOS EL ADMIN SINO NO PODEMOS CREAR NADA
const localidadRouter = Router();

const localidadController = new LocalidadController();

localidadRouter.get('/', localidadController.findAll);
localidadRouter.get('/:id', localidadController.findOne);
localidadRouter.post(
  '/',
  /*verificarToken, verificarRol(RolUsuario.ADMIN)*/ md.sanitizeInput,
  md.validarCrearDatos,
  localidadController.saveOne
);
localidadRouter.put(
  '/:id',
  /*verificarToken, verificarRol(RolUsuario.ADMIN)*/ md.sanitizeInput,
  md.validarCrearDatos,
  localidadController.updateOne
);
localidadRouter.patch(
  '/:id',
  /*verificarToken, verificarRol(RolUsuario.ADMIN)*/ md.sanitizeInput,
  md.validarActualizarDatos,
  localidadController.updateOne
);
localidadRouter.delete(
  '/:id',
  /*verificarToken, verificarRol(RolUsuario.ADMIN)*/ localidadController.removeOne
);

export default localidadRouter;
