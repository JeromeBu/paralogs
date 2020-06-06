import { EnvironmentOption } from "../../../../../config/env";

const migrations = {
  // schemaName: "auth",
  tableName: "knex_auth_migrations",
  extension: "ts",
  directory: `${__dirname}/migrations`,
};

const pool = {
  min: 2,
  max: 10,
};

const knexconfig: { [key in EnvironmentOption]: any } = {
  development: {
    client: "pg",
    connection: {
      port: 5432,
      database: "paralogs-dev",
      user: "postgres",
      password: "pg-password",
    },
    pool,
    migrations,
  },
  test: {
    client: "pg",
    connection: {
      port: 5433,
      database: "paralogs-test",
      user: "postgres",
      password: "pg-password",
    },
    pool,
    migrations,
  },

  // production: {
  //   client: "postgresql",
  //   connection: {
  //     database: "paralogs",
  //     user: "username",
  //     password: "password",
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10,
  //   },
  //   migrations: {
  //     tableName: "knex_migrations",
  //   },
  // },
};

export = knexconfig;
