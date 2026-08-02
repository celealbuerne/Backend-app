import { MikroORM } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

export const orm = await MikroORM.init({
  metadataProvider: TsMorphMetadataProvider,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  driver: MySqlDriver, // cambio; anterior: type: 'mysql'
  dbName: 'backend',
  highlighter: new SqlHighlighter(),
  clientUrl: 'mysql://f:sas@127.0.0.1:3306/backend',
  debug: true,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export async function syncSchema() {
  //const generator = orm.schema; //cambio de nombre
  /*   
  await generator.drop() //cambio de nombre
  await generator.create() //cambio de nombre
  */
  //await generator.update() //cambio de nombre
  const generator = orm.schema;
  /*   
  await generator.dropSchema()
  await generator.createSchema()
  */
  await generator.updateSchema();
}
