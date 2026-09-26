export interface CreatePublicacionDTO {
  fechaInicioDisponibilidad: Date;
  fechaFinDisponibilidad: Date;
  descripcion: string;
  precioPorKM: number;
  aeronaveID: number;
}

export interface UpdatePublicacionDTO {
  fechaInicioDisponibilidad?: Date;
  fechaFinDisponibilidad?: Date;
  descripcion?: string;
  precioPorKM?: number;
}
