import { OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';

// @Entity({abstract: true})
export abstract class BaseEntity<Optional = never> {
  // esto es para que typescript no de error en esas propiedades
  // al usar em.create()
  [OptionalProps]?: 'fechaAlta' | 'fechaModificacion' | Optional;

  @PrimaryKey()
  readonly id!: number;

  @Property()
  readonly fechaAlta: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  fechaModificacion: Date = new Date();
}
