import { throwIfNotInArray, throwIfVariableUndefined } from "@paralogs/shared";
import dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/../../../../.env` });

const jwtSecret = throwIfVariableUndefined("JWT_SECRET");
const nodeEnv = throwIfNotInArray(
  ["development", "test" /* "staging", "production" */],
  "NODE_ENV",
);
const repositories = throwIfNotInArray(["IN_MEMORY", "PG"], "REPOSITORIES");
const eventBus = throwIfNotInArray(["IN_MEMORY", "REDIS"], "EVENT_BUS");

export const ENV = {
  nodeEnv,
  jwtSecret,
  repositories,
  eventBus,
};

export type RepositoriesOption = typeof ENV.repositories;
export type EventBusOption = typeof ENV.eventBus;
export type EnvironmentOption = typeof ENV.nodeEnv;

// eslint-disable-next-line no-console
console.log("- ENV variables -");
// eslint-disable-next-line no-console
console.log(ENV);
