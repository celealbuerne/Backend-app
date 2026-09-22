import {Publicacion} from './publicacion.entity.js';
import {orm} from '../shared/db/orm.js';
import {EntityData} from '@mikro-orm/core';
import {CreatePublicacionDTO, UpdatePublicacionDTO } from './publicacion.dto.js';
import {BadRequestError} from '../shared/errors/badRequest.error.js';
import {Aeronave} from '../aeronave/aeronave.entity.js';

export class PublicacionService {

    findAll = async () => { 
        const publicaciones = await orm.em.findAll(Publicacion, {populate: ['laAeronave']});
        return publicaciones;
    };

    getOne = async (id: number) => {
        const publicacion = await orm.em.findOneOrFail(Publicacion, {id}, {populate: ['laAeronave']});
        return publicacion;
    };

    //va imagen: string pq el service guarda el nombre de la img
    saveOne = async (input: CreatePublicacionDTO, imagen: string) => {
        const aeronave = await orm.em.findOne(Aeronave, {id: input.aeronaveID});
        if (!aeronave)
            throw new BadRequestError();
        const nuevaPublicacion = orm.em.create(Publicacion, { //VA ASI PQ DTO DISTINTO DE ENTIDAD
            descripcion: input.descripcion,
            precioPorKM: input.precioPorKM,
            imagen: imagen, //recibe de multer
            estado: 'activo',
            laAeronave: aeronave
        });
        await orm.em.flush();
        return nuevaPublicacion;
    };

    updateOne = async (id: number, input: UpdatePublicacionDTO, imagen?: string) => {
        const publicacion = await orm.em.findOne(Publicacion, {id});
        if (!publicacion)
            throw new BadRequestError('La publicacion ingresada no existe');
        orm.em.assign(publicacion, input as EntityData<Publicacion>);
        if (imagen !== undefined) {
        publicacion.imagen = imagen;
        }
        await orm.em.flush();
        return publicacion;
    };

    removeOne = async (id: number) => {
        const publicacion = await orm.em.findOne(Publicacion, {id});
        if (!publicacion)
            throw new BadRequestError('La publicacion ingresada no existe');
        orm.em.remove(publicacion);
        await orm.em.flush()
        return publicacion;
    };

//----------------------------------------------------------------------------------//

//USUARIO-CLIENTE

//con FILTRO De precio
    findActivas = async (precioMax?: number, precioMin?: number) => {
        const filtro: any = {estado: 'activo'};
        if (precioMax !== undefined || precioMin !== undefined) {
            filtro.precioPorKM = {};
            
            if (precioMax !== undefined) {
                filtro.precioPorKM.$lte = precioMax;
            }
            if (precioMin !== undefined){ 
                filtro.precioPorKM.$gte = precioMin;
            }
        }
        const publicaciones = await orm.em.find(Publicacion, filtro, {populate: ['laAeronave']});   //solo find sin error pq puede devolver array vacio
        return publicaciones;
    };

//----------------------------------------------------------------------------------//

// PROVEEDOR

//publicaciones del proveedor   
    findMisPublicaciones = async (proveedorID: number) => {
        const publicaciones = await orm.em.find(Publicacion, {laAeronave: {miProveedor: proveedorID}}, {populate: ['laAeronave']});
        return publicaciones;
    };
}