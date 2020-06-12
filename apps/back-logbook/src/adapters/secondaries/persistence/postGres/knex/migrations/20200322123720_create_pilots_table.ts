import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("pilots", (table) => {
    table.increments("id").primary().notNullable();
    table.string("uuid", 60).unique().notNullable();
    table.string("first_name", 100).notNullable();
    table.string("last_name", 100);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("pilots");
}
