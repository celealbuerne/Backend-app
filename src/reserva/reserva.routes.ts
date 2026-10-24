import { Router } from 'express';
import { ReservaController } from './reserva.controller.js';
import { RolUsuario } from '../usuario/usuario.entity.js';
import { verificarToken, verificarRol } from '../auth/auth.middleware.js';
import * as md from './reserva.middleware.js';

const ReservaRouter = Router();
const controller = new ReservaController();

ReservaRouter.get(
  '/',
  verificarToken,
  verificarRol(RolUsuario.CLIENTE, RolUsuario.PROVEEDOR, RolUsuario.ADMIN),
  md.sanitizeFiltros,
  controller.findAll
);

ReservaRouter.get(
  '/disponibilidad/:publicacionID',
  verificarToken,
  controller.findFechasOcupadas
);

ReservaRouter.get(
  '/:id',
  verificarToken,
  verificarRol(RolUsuario.CLIENTE, RolUsuario.PROVEEDOR, RolUsuario.ADMIN), 
  controller.getOne
);

ReservaRouter.post(
  '/',
  verificarToken,
  verificarRol(RolUsuario.CLIENTE),
  md.sanitizeInput,
  md.validarCrearReserva,
  controller.create
);

ReservaRouter.patch(
  '/:id/estado',
  verificarToken,
  verificarRol(RolUsuario.PROVEEDOR),
  md.sanitizeEstadoInput,
  md.validarActualizarEstado,
  controller.update
);

export default ReservaRouter;
