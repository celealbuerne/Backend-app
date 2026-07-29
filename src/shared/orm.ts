import { MikroORM } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

export const orm = await MikroORM.init({
    entities: ["dist/**/*.model.js"],
    entitiesTs: ["src/**/*.model.ts"],
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
})

export async function syncSchema() {
  const generator = orm.schema; //cambio de nombre
  /*   
  await generator.drop() //cambio de nombre
  await generator.create() //cambio de nombre
  */
  await generator.update() //cambio de nombre
}