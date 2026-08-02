import "reflect-metadata";
import express  from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import { orm, syncSchema } from "./shared/orm.js";
import errorHandler from './middlewares/errorHandler.js';
import { RequestContext } from "@mikro-orm/core";
import aeronaveRouter from "./routes/aeronave.routes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// es el orm.em.fork()
app.use((req: Request, res: Response, next) =>{
  RequestContext.create(orm.em, next);
})

app.use('/api/aeronaves', aeronaveRouter)

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'hola buenas' });
});
app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

app.use(errorHandler);

await syncSchema(); // para desarrollo

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
