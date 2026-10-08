import { Router } from 'express';
import { PublicacionController } from './publicacion.controller';
import * as md from './publicacion.middleware';
import { uploadImagenPublicacion } from '../shared/middlewares/multer.middleware.js';
import { verificarToken, verificarRol } from '../auth/auth.middleware.js';
import { RolUsuario } from '../usuario/usuario.entity.js';

const publicacionRouter = Router();
const publicacionController = new PublicacionController();

publicacionRouter.post(
  '/',
  verificarToken,
  verificarRol(RolUsuario.PROVEEDOR),
  uploadImagenPublicacion.single('imagen'),
  md.sanitizeInput,
  md.validarCrearPublicacion,
  publicacionController.saveOne
);
publicacionRouter.get('/', publicacionController.findAll);
publicacionRouter.get('/recientes', publicacionController.findByRecientes); 
publicacionRouter.get('/MisPublicaciones/:proveedorID', publicacionController.findMisPublicaciones);
publicacionRouter.get('/:id', publicacionController.getOne);
publicacionRouter.put(
  '/:id',
  uploadImagenPublicacion.single('imagen'),
  md.sanitizeInput,
  md.validarCrearPublicacion,
  publicacionController.updateOne
);
publicacionRouter.patch(
  '/:id',
  uploadImagenPublicacion.single('imagen'),
  md.sanitizeInput,
  md.validarActualizarDatos,
  publicacionController.updateOne
);
publicacionRouter.delete('/:id', publicacionController.removeOne);

export default publicacionRouter;
