export interface CreatePublicacionDTO {
  descripcion: string;
  precioPorKM: number;
  aeronaveID: number;  //id
}

export interface UpdatePublicacionDTO {
  descripcion?: string;
  precioPorKM?: number;
  //estado?: 'activo' | 'inactivo';
}
