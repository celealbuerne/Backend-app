import express from 'express';
import { Request, Response } from 'express';
import errorHandler from './middlewares/errorHandler';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'hola buenas' });
});

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
