import multer from 'multer';
import path from 'path';
import fs from 'fs'; //file system
import { Request } from 'express';

const uploadDir = path.join(process.cwd(), 'uploads', 'publicaciones'); //crea variable que representa la carpeta donde vamos a guardar las imagenes

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  //las imagenes se guardan en disco, en esa carpeta
  destination: uploadDir,

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname); //obtiene solo la extension
    const nombre = `${Date.now()}${extension}`; //nombre unico

    cb(null, nombre);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

  if (tiposPermitidos.includes(file.mimetype)) {
    //mime type es el tipo de archivo
    cb(null, true); //sin error y acepta el archivo
  } else {
    cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'));
  }
};

export const uploadImagenPublicacion = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
