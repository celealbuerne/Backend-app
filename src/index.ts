import 'reflect-metadata';
import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import { orm, syncSchema } from './shared/db/orm.js';
import errorHandler from './shared/middlewares/errorHandler.js';
import { RequestContext } from '@mikro-orm/core';
import aeronaveRouter from './aeronave/aeronave.routes.js';
import usuarioRouter from './usuario/usuario.routes.js';
import localidadRouter from './localidad/localidad.routes.js';
import aeropuertoRouter from './aeropuerto/aeropuerto.routes.js';
import publicacionRouter from './publicacion/publicacion.routes.js';
import authRouter from './auth/auth.routes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// es el orm.em.fork()
app.use((req: Request, res: Response, next) => {
  RequestContext.create(orm.em, next);
});

app.use('/api/aeronaves', aeronaveRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/localidades', localidadRouter);
app.use('/api/aeropuertos', aeropuertoRouter);
app.use('/api/publicaciones', publicacionRouter);
app.use('/api/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'hola buenas' });
});
app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' });
});

app.use(errorHandler);

await syncSchema(); // para desarrollo

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
