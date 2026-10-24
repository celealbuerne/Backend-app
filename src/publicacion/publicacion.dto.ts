export interface CreatePublicacionDTO {
  descripcion: string;
  precioPorDia: number;
  aeronaveID: number;
}

export interface UpdatePublicacionDTO {
  descripcion?: string;
  precioPorDia?: number;
}
