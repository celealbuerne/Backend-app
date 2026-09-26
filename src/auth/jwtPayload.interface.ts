import { RolUsuario } from '../usuario/usuario.entity.js';

export interface JwtPayload {
  id: number;
  roles: RolUsuario[];
}
