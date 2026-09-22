import {EntityData} from '@mikro-orm/core';
import {Aeropuerto} from './aeropuerto.entity.js';
import {CreateAeropuertoDTO} from './createAeropuerto.dto.js';
import {orm} from '../shared/db/orm.js';
import { Localidad } from '../localidad/localidad.entity.js';
import { BadRequestError } from '../shared/errors/badRequest.error.js';

export class AeropuertoService {

    //FIND ALL Y FILTRO DE AEROPUERTOS POR LOCALIDAD
    findAll = async (localidadID?: number) => {
        if (localidadID){
            const localidad = await orm.em.findOne(Localidad, {id: localidadID});
            if (!localidad) {
                throw new BadRequestError('La localidad ingresada no existe.');
            }
            const aeropuertos = await orm.em.find(Aeropuerto, {laLocalidad: localidad}, {populate: ['laLocalidad']});
            return {localidad, aeropuertos};
        }
        const aeropuertos = await orm.em.findAll(Aeropuerto, {populate: ['laLocalidad']});
        return {localidad:null, aeropuertos};
    };



    getOne = async (id: number) => {
        const aeropuerto = await orm.em.findOneOrFail(Aeropuerto, {id}, {populate: ['laLocalidad']});
        return aeropuerto;
    };

    saveOne = async (input: CreateAeropuertoDTO) => {   
        const localidad = await orm.em.findOne(Localidad, { id: input.localidadID });
        if (!localidad) {
            throw new BadRequestError('La localidad ingresada no existe.');
        }

        const nuevoAeropuerto = orm.em.create(Aeropuerto, {  //VA ASI PQ DTO DISTINTO DE ENTIDAD
            nombre: input.nombre,
            codigo: input.codigo,
            laLocalidad: localidad
        });
        await orm.em.flush();
        return nuevoAeropuerto;
    };

    updateOne = async (id: number, input: EntityData<Aeropuerto>) => {
        const aeropuerto = await orm.em.findOne(Aeropuerto, {id});
        if (!aeropuerto){
            throw new BadRequestError('El aeropuerto ingresado no existe.');
        }
        orm.em.assign(aeropuerto, input);
        await orm.em.flush();
        return aeropuerto;
    };

    removeOne = async (id: number) => {
        const aeropuerto = await orm.em.findOne(Aeropuerto, {id});
        if (!aeropuerto){
            throw new BadRequestError('El aeropuerto ingresado no existe.');
        }
        orm.em.remove(aeropuerto);
        await orm.em.flush();
        return aeropuerto;
    }}

