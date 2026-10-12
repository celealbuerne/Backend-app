import { Contacto } from './contacto.entity.js';
import { RolUsuario } from './usuario.entity.js';

export interface CreateUsuarioDTO {
  nombre: string;
  nombreUsuario: string;
  contraseña: string;
  pais: string;
  fechaNacimiento: Date;
  tipoDocumento: string;
  documento: number;
  roles?: RolUsuario[];
  contacto?: Contacto[];
}
