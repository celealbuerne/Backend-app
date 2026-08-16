import { RequiredEntityData } from "@mikro-orm/core";
import { orm } from "../shared/db/orm.js"
import { CreateUsuarioDTO } from "./createUsuario.dto.js";
import { Usuario } from "./usuario.entity.js"

export class UsuarioService {
    findAll = async () => {
        const usuarios = await orm.em.findAll(Usuario);
        return usuarios;
    }

    getOne = async (id: number) => {
        const usuario = orm.em.findOneOrFail(Usuario, { id });
        return usuario;
    }

    saveOne = async (input: CreateUsuarioDTO) => {
        const nuevoUsuario = orm.em.create(Usuario, input as RequiredEntityData<Usuario>)
        await orm.em.flush();
        return nuevoUsuario;
    }
}