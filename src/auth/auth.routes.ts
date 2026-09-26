// auth/auth.routes.ts
import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import * as md from './validarAuth.middleware.js';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/register', md.sanitizedInput, md.validarRegister, authController.register);

authRouter.post('/login', md.sanitizedInput, md.validarLogin, authController.login);

export default authRouter;
