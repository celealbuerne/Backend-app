import { Router } from 'express';
import { PublicacionController } from './publicacion.controller';
import * as md from './publicacion.middleware';
import { uploadImagenPublicacion } from '../shared/middlewares/multer.middleware.js';

const publicacionRouter = Router();
const publicacionController = new PublicacionController();

publicacionRouter.post(
  '/',
  uploadImagenPublicacion.single('imagen'),
  md.sanitizeInput,
  md.validarCrearPublicacion,
  publicacionController.saveOne
);
publicacionRouter.get('/', publicacionController.findAll);
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
