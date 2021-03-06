import {
  throwIfNotInArray,
  throwIfVariableUndefined,
} from "@paralogs/shared/common";
import dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/../../../../.env` });

const jwtSecret = throwIfVariableUndefined("JWT_SECRET");
const nodeEnv = throwIfNotInArray(
  ["development", "test" /* "staging", "production" */],
  "NODE_ENV",
);
const repositories = throwIfNotInArray(["IN_MEMORY", "PG"], "REPOSITORIES");
const eventBus = throwIfNotInArray(
  ["IN_MEMORY", "REDIS", "KAFKA"],
  "EVENT_BUS",
);

const isDockerCompose = process.env.IS_DOCKER_COMPOSE === "TRUE";

export const ENV = {
  nodeEnv,
  jwtSecret,
  repositories,
  eventBus,
  pgHost: isDockerCompose ? "pg" : "localhost",
  redisHost: isDockerCompose ? "redis" : "localhost",
  pgPort: isDockerCompose || nodeEnv === "development" ? 5432 : 5433,
};

export type RepositoriesOption = typeof ENV.repositories;
export type EventBusOption = typeof ENV.eventBus;
export type EnvironmentOption = typeof ENV.nodeEnv;
