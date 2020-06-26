import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary().notNullable();
    table.string("uuid", 60).unique().notNullable();
    table.string("email", 60).unique().notNullable();
    table.string("first_name", 100).notNullable();
    table.string("last_name", 100);
    table.string("password", 60).notNullable();
    table.string("auth_token", 255);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("users");
}
