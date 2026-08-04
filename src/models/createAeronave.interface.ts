export interface CreateAeronaveInput {
  modelo: string;
  fabricante: string;
  descripcion?: string;
  capacidad: number;
  autonomia: number;
  velocidadMaxima: number;
  antiguedad: Date;
  miProveedor: number;
}
