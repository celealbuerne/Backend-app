export interface CreateUsuarioDTO {
  nombre: string;
  nombreUsuario: string;
  contraseña: string;
  pais: string;
  tipoDocumento: string;
  documento: number;
  fechaNacimiento: Date;
  contacto?: string[];
}
