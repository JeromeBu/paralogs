import {
  createInMemoryEventBus,
  createRedisEventBus,
  EventBus,
} from "@paralogs/back-shared";

import { InMemoryFlightRepo } from "../adapters/secondaries/persistence/inMemory/InMemoryFlightRepo";
import { InMemoryPilotRepo } from "../adapters/secondaries/persistence/inMemory/InMemoryPilotRepo";
import { InMemoryWingRepo } from "../adapters/secondaries/persistence/inMemory/InMemoryWingRepo";
import { createPgFlightQueries } from "../adapters/secondaries/persistence/postGres/flights/PgFlightQueries";
import { PgFlightRepo } from "../adapters/secondaries/persistence/postGres/flights/PgFlightRepo";
import { getKnex } from "../adapters/secondaries/persistence/postGres/knex/db";
import { PgPilotRepo } from "../adapters/secondaries/persistence/postGres/pilots/PgPilotRepo";
import { createPgWingQueries } from "../adapters/secondaries/persistence/postGres/wings/PgWingQueries";
import { PgWingRepo } from "../adapters/secondaries/persistence/postGres/wings/PgWingRepo";
import { FlightQueries } from "../domain/reads/gateways/FlightQueries";
import { WingQueries } from "../domain/reads/gateways/WingQueries";
import { FlightRepo } from "../domain/writes/gateways/FlightRepo";
import { PilotRepo } from "../domain/writes/gateways/PilotRepo";
import { WingRepo } from "../domain/writes/gateways/WingRepo";
import { flightMapper } from "../domain/writes/mappers/flight.mapper";
import { wingMapper } from "../domain/writes/mappers/wing.mapper";
import { ENV, EventBusOption, RepositoriesOption } from "./env";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const shouldNeverBeCalled = (arg: never) => {
  throw new Error("Should never be called");
};

interface Repositories {
  pilot: PilotRepo;
  wing: WingRepo;
  flight: FlightRepo;
}

interface Queries {
  wing: WingQueries;
  flight: FlightQueries;
}

interface Persistence {
  repositories: Repositories;
  queries: Queries;
}

const getInMemoryPersistence = (): Persistence => {
  const wingRepo = new InMemoryWingRepo();
  const flightRepo = new InMemoryFlightRepo();
  return {
    queries: {
      wing: {
        findByPilotUuid: async (pilotUuid) =>
          wingRepo.wings
            .filter((wing) => wing.pilotUuid === pilotUuid)
            .map(wingMapper.entityToDTO),
      },
      flight: {
        findByPilotUuid: async (pilotUuid) =>
          flightRepo.flights
            .filter((flight) => flight.pilotUuid === pilotUuid)
            .map(flightMapper.entityToDTO),
      },
    },
    repositories: {
      pilot: new InMemoryPilotRepo(),
      wing: wingRepo,
      flight: flightRepo,
    },
  };
};

const pgPersistence = (): Persistence => {
  const knex = getKnex(ENV.nodeEnv);
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  if (ENV.nodeEnv !== "test") knex.migrate.latest();
  return {
    queries: {
      wing: createPgWingQueries(knex),
      flight: createPgFlightQueries(knex),
    },
    repositories: {
      pilot: new PgPilotRepo(knex),
      wing: new PgWingRepo(knex),
      flight: new PgFlightRepo(knex),
    },
  };
};

const getRepositoriesAndQueries = (
  repositories: RepositoriesOption,
): Persistence => {
  switch (repositories) {
    case "IN_MEMORY":
      return getInMemoryPersistence();
    case "PG":
      return pgPersistence();
    default:
      return shouldNeverBeCalled(repositories);
  }
};

const getEventBus = (repositories: EventBusOption): EventBus => {
  switch (repositories) {
    case "IN_MEMORY":
      return createInMemoryEventBus({ getNow: () => new Date() });
    case "REDIS":
      return createRedisEventBus();
    default:
      return shouldNeverBeCalled(repositories);
  }
};

export const { repositories, queries } = getRepositoriesAndQueries(
  ENV.repositories,
);

export const eventBus = getEventBus(ENV.eventBus);
