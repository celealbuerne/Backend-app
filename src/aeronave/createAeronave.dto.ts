export interface CreateAeronaveDTO {
  modelo: string;
  fabricante: string;
  descripcion?: string;
  capacidad: number;
  autonomia: number;
  velocidadMaxima: number;
  antiguedad: Date;
  //proveedor: number;  del token
  ultimoAeropuerto: number;
}
