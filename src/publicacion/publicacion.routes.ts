import { Router } from "express";
import {PublicacionController} from "./publicacion.controller";
import * as md from "./publicacion.middleware";
import {uploadImagenPublicacion} from "../shared/middlewares/multer.middleware.js";

const router = Router();
const publicacionController = new PublicacionController()

router.post("/", uploadImagenPublicacion.single('imagen'), md.sanitizeInput, md.validarCrearPublicacion, publicacionController.saveOne);
router.get("/", publicacionController.findAll);
router.get('/activas',publicacionController.findActivas);
router.get("/MisPublicaciones/:proveedorID", publicacionController.findMisPublicaciones);
router.get("/:id", publicacionController.getOne);
router.put("/:id", uploadImagenPublicacion.single('imagen'), md.sanitizeInput, md.validarCrearPublicacion, publicacionController.updateOne);
router.patch("/:id", uploadImagenPublicacion.single('imagen'), md.sanitizeInput, md.validarActualizarDatos, publicacionController.updateOne);
router.delete("/:id", publicacionController.removeOne);

export default router;