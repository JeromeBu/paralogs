import { ENV, EnvironmentOption } from "@paralogs/shared/back";

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
      host: ENV.pgHost,
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
      host: ENV.pgHost,
      port: ENV.pgPort,
      database: "paralogs-test",
      user: "postgres",
      password: "pg-password",
    },
    pool,
    migrations,
  },
};

export default knexconfig;
