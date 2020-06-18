import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("wings", (table) => {
    table.increments("id").primary().notNullable();
    table.string("uuid", 60).unique().notNullable();
    table.string("pilot_uuid", 60).notNullable().index();
    table
      .integer("pilot_id")
      .notNullable()
      .references("id")
      .inTable("pilots")
      .onDelete("CASCADE")
      .index();
    table.string("brand", 100).notNullable();
    table.string("model", 100).notNullable();
    table.string("owner_from", 100);
    table.string("owner_until", 100);
    table.integer("flight_time_prior_to_own").notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("wings");
}
