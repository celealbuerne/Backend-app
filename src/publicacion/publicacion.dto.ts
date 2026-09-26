export interface CreatePublicacionDTO {
  fechaInicioDisponibilidad: Date;
  fechaFinDisponibilidad: Date;
  descripcion: string;
  precioPorKM: number;
  aeronaveID: number; // revisar en auth??¿
}

export interface UpdatePublicacionDTO {
  fechaInicioDisponibilidad?: Date;
  fechaFinDisponibilidad?: Date;
  descripcion?: string;
  precioPorKM?: number;
}
