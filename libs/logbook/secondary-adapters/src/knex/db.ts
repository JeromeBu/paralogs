import Knex from "knex";

import knexconfig from "./knexfile";

type DatabaseEnv = keyof typeof knexconfig;

export const getKnex = (databaseEnv: DatabaseEnv) => {
  return Knex(knexconfig[databaseEnv]);
};

export const resetDb = async (knex: Knex) => {
  await knex.migrate.rollback({}, true);
  await knex.migrate.latest();
};
