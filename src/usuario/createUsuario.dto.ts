import { Contacto } from './contacto.entity.js';
import { RolUsuario } from './usuario.entity.js';

export interface CreateUsuarioDTO {
  nombre: string;
  nombreUsuario: string;
  contraseña: string; // ya encriptada
  pais: string;
  fechaNacimiento: Date;
  tipoDocumento: string;
  documento: number;
  roles?: RolUsuario[];
  estado?: string;
  contacto?: Contacto[];
}
