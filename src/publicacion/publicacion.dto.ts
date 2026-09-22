export interface CreatePublicacionDTO {
  descripcion: string;
  precioPorKM: number;
  //imagen: string;
  aeronaveID: number;  //id
}

export interface UpdatePublicacionDTO {
  descripcion?: string;
  precioPorKM?: number;
  //imagen?: string;
  estado?: 'activo' | 'inactivo';
}
