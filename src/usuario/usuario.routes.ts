import { Router } from 'express';
import { UsuarioController } from './usuario.controller.js';
import * as md from './usuario.middleware.js';
//import { verificarToken, verificarRol } from '../auth/auth.middleware.js';

const usuarioRouter = Router();
const c = new UsuarioController();

//aca no se puede usar el verificarRol de auth porque si usamos verificarRol(RolUsuario.ADMIN)
//"admin", full stop — bloquearia al dueño del perfil que no es admin. Se necesita la lógica "sos dueño O sos admin"
// CRUD
usuarioRouter.get('/', /*verificarToken, verificarRol(RolUsuario.ADMIN)*/ c.findAll);
usuarioRouter.get('/:id', /*verificarToken*/ md.esDueñoOAdmin, c.getOne);
//usuarioRouter.post('/', md.sanitizeInput, md.validarCrearDatos, c.saveOne);
usuarioRouter.put(
  '/:id',
  /*verificarToken*/ md.esDueñoOAdmin,
  md.sanitizeInput,
  md.validarCrearDatos,
  c.updateOne
);
usuarioRouter.patch('/:id', /*verificarToken*/ md.esDueñoOAdmin, md.sanitizeInput, c.updateOne);
usuarioRouter.delete('/:id', /*verificarToken, verificarRol(RolUsuario.ADMIN)*/ c.removeOne);

export default usuarioRouter;
