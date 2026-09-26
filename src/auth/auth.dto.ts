import { RolUsuario } from '../usuario/usuario.entity.js';

export interface RegisterDTO {
  nombre: string;
  nombreUsuario: string;
  pais: string;
  fechaNacimiento: Date;
  tipoDocumento: string;
  documento: number;
  contraseña: string;
  rol: RolUsuario;
}

export interface LoginDTO {
  nombreUsuario: string;
  contraseña: string;
}
