import {Publicacion} from './publicacion.entity.js';
import {orm} from '../shared/db/orm.js';
import {EntityData} from '@mikro-orm/core';
import {CreatePublicacionDTO, UpdatePublicacionDTO } from './publicacion.dto.js';
import {BadRequestError} from '../shared/errors/badRequest.error.js';
import {Aeronave} from '../aeronave/aeronave.entity.js';
import {Reserva} from '../reserva/reserva.entity.js';
import {EstadoReserva} from '../reserva/reserva.entity.js';

export class PublicacionService {

    //Con filtro por precio y ademas no se ven las q estan "vencidas"
    findAll = async (precioMax?: number, precioMin?: number) => { 
        const filtro: any = { fechaFinDisponibilidad: { $gte: new Date()}};
        if (precioMax !== undefined || precioMin !== undefined) {
            filtro.precioPorKM = {};
            
            if (precioMax !== undefined) {
                filtro.precioPorKM.$lte = precioMax;
            }
            if (precioMin !== undefined){ 
                filtro.precioPorKM.$gte = precioMin;
            }
        }
        const publicaciones = await orm.em.find(Publicacion, filtro, {populate: ['laAeronave']});
        return publicaciones;
    };

    getOne = async (id: number) => {
        const publicacion = await orm.em.findOneOrFail(Publicacion, {id}, {populate: ['laAeronave']});
        return publicacion;
    };

    //va imagen: string pq el service guarda el nombre de la img
    saveOne = async (input: CreatePublicacionDTO, imagen: string, aeronave: Aeronave) => {

        const nuevaPublicacion = orm.em.create(Publicacion, { //VA ASI PQ DTO DISTINTO DE ENTIDAD
            fechaInicioDisponibilidad: input.fechaInicioDisponibilidad,
            fechaFinDisponibilidad: input.fechaFinDisponibilidad,
            descripcion: input.descripcion,
            precioPorKM: input.precioPorKM,
            imagen: imagen, //recibe de multer
            laAeronave: aeronave
        });
        await orm.em.flush();
        return nuevaPublicacion;
    };

    updateOne = async (id: number, input: UpdatePublicacionDTO, imagen?: string) => {
        const publicacion = await orm.em.findOne(Publicacion, {id});
        if (!publicacion)
            throw new BadRequestError('La publicacion ingresada no existe');
        /* Si se modifican las fechas, verificamos que no haya
        // reservas activas que queden fuera del nuevo período */
        if (
            input.fechaInicioDisponibilidad !== undefined ||
            input.fechaFinDisponibilidad !== undefined
        ) {

            const nuevaFechaInicio = input.fechaInicioDisponibilidad ?? publicacion.fechaInicioDisponibilidad;

            const nuevaFechaFin = input.fechaFinDisponibilidad ?? publicacion.fechaFinDisponibilidad;

            const reservasActivas = await orm.em.find(Reserva, {publicacion: {id},estado: {  $in: [EstadoReserva.CONFIRMADA, EstadoReserva.PENDIENTE] }});

            for (const reserva of reservasActivas) {
                if (
                    reserva.fechaInicio < nuevaFechaInicio ||
                    reserva.fechaFin > nuevaFechaFin
                ) {
                    throw new BadRequestError('No se puede modificar la disponibilidad porque existen reservas fuera del nuevo período');
                }
            }
        }

        orm.em.assign(publicacion, input as EntityData<Publicacion>);
        if (imagen !== undefined) {
        publicacion.imagen = imagen;
        }
        await orm.em.flush();
        return publicacion;
    };

    removeOne = async (id: number) => {
        const publicacion = await orm.em.findOne(Publicacion, { id });
        if (!publicacion)
            throw new BadRequestError('La publicacion ingresada no existe');

        const reservasActivas = await orm.em.find(Reserva, {publicacion: {id},estado: {  $in: [EstadoReserva.CONFIRMADA, EstadoReserva.PENDIENTE] }});

        if (reservasActivas.length > 0) {
            throw new BadRequestError('No se puede eliminar la publicación porque tiene reservas activas o pendientes');
        }

    orm.em.remove(publicacion);
    await orm.em.flush();
    return { eliminada: true };
};

//----------------------------------------------------------------------------------//

// PROVEEDOR

//publicaciones del proveedor   
    findMisPublicaciones = async (proveedorID: number) => {
        const publicaciones = await orm.em.find(Publicacion, {laAeronave: {miProveedor: proveedorID}}, {populate: ['laAeronave']});
        return publicaciones;
    };
}