export interface CreateUsuarioDTO {
  nombre: string;
  pais: string;
  tipoDocumento: string;
  documento: number;
  fechaNacimiento: Date;
  contacto?: string[];
}