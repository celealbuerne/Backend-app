import { Router } from 'express';
import { UsuarioController } from './usuario.controller.js';
import * as md from './usuario.middleware.js';
import { verificarToken, verificarRol } from '../auth/auth.middleware.js';
import { RolUsuario } from './usuario.entity.js';

const usuarioRouter = Router();
const c = new UsuarioController();

// CRUD
usuarioRouter.get('/', verificarToken, verificarRol(RolUsuario.ADMIN), c.findAll);
usuarioRouter.get('/:id', verificarToken, md.esDueñoOAdmin, c.getOne);
// usuarioRouter.post('/', md.sanitizeInput, md.validarCrearDatos, c.saveOne);
usuarioRouter.put(
  '/:id',
  verificarToken,
  md.esDueñoOAdmin,
  md.sanitizeInput,
  md.validarCrearDatos,
  c.updateOne
);
usuarioRouter.patch('/:id', verificarToken, md.esDueñoOAdmin, md.sanitizeInput, c.updateOne);
usuarioRouter.delete('/:id', verificarToken, verificarRol(RolUsuario.ADMIN), c.removeOne);

export default usuarioRouter;
