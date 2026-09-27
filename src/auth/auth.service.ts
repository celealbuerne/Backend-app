import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { RegisterDTO, LoginDTO } from './auth.dto.js';
import { RolUsuario } from '../usuario/usuario.entity.js';
import { BadRequestError } from '../shared/errors/badRequest.error.js';
import { UnauthorizedError } from '../shared/errors/unauthorized.error.js';
import { JwtPayload } from './jwtPayload.interface.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../shared/config/jwt.config.js';
import { UsuarioService } from '../usuario/usuario.service.js';

//FALTARIA HACER EL CASO DE OLVIDE MI CONTRASEÑA, PERO PARA ESO NECISTAMOS EL MAIL

export class AuthService {
  // mucho muy importante
  constructor(private usuarioService: UsuarioService = new UsuarioService()) {}

  register = async (data: RegisterDTO) => {
    const userExists = await this.usuarioService.findByUsername(data.nombreUsuario);
    // const userExistente = await orm.em.findOne(Usuario, { nombreUsuario: data.nombreUsuario });
    if (userExists) {
      throw new BadRequestError('El nombre de usuario ingresado ya está en uso.');
    }
    const contraseñaCifrada = await bcrypt.hash(data.contraseña, 10);

    const nuevoUsuario = await this.usuarioService.create({
      nombre: data.nombre,
      nombreUsuario: data.nombreUsuario,
      contraseña: contraseñaCifrada,
      pais: data.pais,
      fechaNacimiento: data.fechaNacimiento,
      tipoDocumento: data.tipoDocumento,
      documento: data.documento,
      roles: [data.rol ?? RolUsuario.CLIENTE],
      estado: 'activo',
      contacto: [],
    });

    /* const nuevoUsuario = orm.em.create(Usuario, {
      nombre: data.nombre,
      nombreUsuario: data.nombreUsuario,
      pais: data.pais,
      fechaNacimiento: data.fechaNacimiento,
      tipoDocumento: data.tipoDocumento,
      documento: data.documento,
      contraseña: contraseñaCifrada,
      roles: [data.rol ?? RolUsuario.CLIENTE], //<----------- A PARTIR DE ESTE PARA ABAJO TIRA ERROR SI NO LOS PONGO
      estado: 'activo', // <----  POR QUE TIENE ESTADO EL USUARIO?
      contacto: [],
    }); */

    /*
    // de todas formas esto era redundante, orm.create ya invoca a persist() internamente en esta version de MikroORM
    orm.em.persist(nuevoUsuario);

    await orm.em.flush();
    */

    return nuevoUsuario;
  };

  login = async (data: LoginDTO) => {
    const usuarioEncontrado = await this.usuarioService.findByUsername(data.nombreUsuario);
    if (!usuarioEncontrado) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    if (usuarioEncontrado.estado !== 'activo') {
      //solo si usamos el ESTADO (que no se donde lo usamos)
      throw new UnauthorizedError('El usuario se encuentra inactivo.');
    }

    const contraseñaValida = await bcrypt.compare(data.contraseña, usuarioEncontrado.contraseña);
    if (!contraseñaValida) {
      throw new UnauthorizedError('La contraseña es incorrecta');
    }

    const payload: JwtPayload = {
      id: usuarioEncontrado.id,
      roles: usuarioEncontrado.roles,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }); //genera el token JWT q contiene el id y roles del user, el secreto y es valido durante 24h
    return { token, usuario: usuarioEncontrado };
  };
}
