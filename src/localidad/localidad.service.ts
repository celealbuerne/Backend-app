import {Localidad} from './localidad.entity';
import {EntityData, RequiredEntityData} from '@mikro-orm/core';
import {CreateLocalidadDTO} from './createLocalidad.dto.js';
import {orm} from '../shared/db/orm.js';  //trae la conexion a la base de datos
import {BadRequestError} from '../shared/errors/badRequest.error.js';

export class LocalidadService {

    findAll = async () => { 
        const localidades = await orm.em.findAll(Localidad); 
        return localidades;
    };

    getOne = async (id: number) => {
        const localidad = await orm.em.findOneOrFail(Localidad, {id}); 
        return localidad;
    };
    
    saveOne = async (input: CreateLocalidadDTO) => {
        const nuevaLocalidad = orm.em.create(Localidad, input as RequiredEntityData<Localidad>); //crea una nueva localidad a partir de los datos recibidos
        await orm.em.flush(); //guarda la nueva localidad en la base de datos
        return nuevaLocalidad;
    };

    updateOne = async (id: number, input: EntityData<Localidad>) => { 
        const localidad = await orm.em.findOne(Localidad, {id}); 
        if (!localidad){
            throw new BadRequestError('La localidad ingresada no existe');
        }
        orm.em.assign(localidad, input); 
        await orm.em.flush();
        return localidad;
    };

    removeOne = async (id: number) => {
        const localidad = await orm.em.findOne(Localidad, {id});
        if (!localidad){
            throw new BadRequestError('La localidad ingresada no existe');
        }
        orm.em.remove(localidad); 
        await orm.em.flush();
        return;
    }}