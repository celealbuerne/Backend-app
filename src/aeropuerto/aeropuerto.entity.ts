import {Entity, Property, ManyToOne, OneToMany, Collection} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Localidad } from '../localidad/localidad.entity.js';


@Entity()
export class Aeropuerto extends BaseEntity {    
    
    @Property()
    nombre: string;

    @Property()
    codigo: string;

    @ManyToOne()
    laLocalidad: Localidad;

    //CREO Q NO LO NECESITAMOS PERO X LAS DUDAS LO DEJO
    //reservasOrigen = new Collection<SolicitudReserva>(this);

    //@OneToMany(() => SolicitudReserva, solicitud => solicitud.destino)
    //reservasDestino = new Collection<SolicitudReserva>(this);

    constructor(
        _nombre: string,
        _codigo: string,
        _laLocalidad: Localidad
    ) {
        super();
        this.nombre = _nombre;
        this.codigo = _codigo;
        this.laLocalidad = _laLocalidad;
    }   
}