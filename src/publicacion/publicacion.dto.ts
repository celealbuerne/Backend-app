export interface CreatePublicacionDTO {
  descripcion: string;
  precioPorKM: number;
  aeronaveID: number;
}

export interface UpdatePublicacionDTO {
  descripcion?: string;
  precioPorKM?: number;
}
