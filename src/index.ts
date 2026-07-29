import "reflect-metadata";
import express  from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import { orm, syncSchema } from "./shared/orm.js";
import errorHandler from './middlewares/errorHandler.js';
import { RequestContext } from "@mikro-orm/core";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next) =>{
  RequestContext.create(orm.em, next);
})

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'hola buenas' });
});

app.use(errorHandler);

await syncSchema(); // para desarrollo

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
