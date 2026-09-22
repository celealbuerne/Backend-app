import {Entity, Property, OneToMany, OneToOne, ManyToOne, Rel, Collection} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Aeronave } from '../aeronave/aeronave.entity.js';

@Entity()
export class Publicacion extends BaseEntity {

    @Property()
    descripcion: string;

    @Property()
    precioPorKM: number;

    @Property()
    estado: 'activo' | 'inactivo' = 'activo'; 

    @Property()
    imagen: string;

    //RELACION UNO A UNO, DUEÑA PUBLICACION
    @OneToOne(() => Aeronave, { inversedBy: 'miPublicacion' })
    laAeronave!: Aeronave;

    //@OneToMany(() => Reserva, (reserva) => reserva.miPublicacion)  
    //reservas= new Collection <Reserva>(this)

    //NO IRIA PQ PUBLI SE REALACIONA CON AERONAVE, Q AERONAVE SE RELACIONA CON USUARIO/PROVEEDOR REVISAR MD
    //  @ManyToOne(() => Usuario)
    // elProveedor: Rel<Usuario>;


    constructor(
        _descripcion: string,
        _precioPorKM: number,
        _imagen: string
    ) {
        super();
        this.descripcion = _descripcion;
        this.precioPorKM = _precioPorKM;
        this.imagen = _imagen;
    }

}


