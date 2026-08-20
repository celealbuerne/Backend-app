import { Router } from "express";
import { UsuarioController } from "./usuario.controller.js";
import * as md from './usuario.middleware.js'

const usuarioRouter = Router();
const c = new UsuarioController();

// CRUD
usuarioRouter.get('/', c.findAll);
usuarioRouter.get('/:id', c.getOne);
usuarioRouter.post('/', md.sanitizeInput, md.validarCrearDatos, c.saveOne);

export default usuarioRouter;