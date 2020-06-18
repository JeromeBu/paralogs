import {
  createInMemoryEventBus,
  createRedisEventBus,
  EventBus,
} from "@paralogs/back/shared";
import {
  FlightQueries,
  FlightRepo,
  PilotRepo,
  WingQueries,
  WingRepo,
  InMemoryFlightRepo,
  InMemoryPilotRepo,
  InMemoryWingRepo,
} from "@paralogs/logbook/domain";
import {
  getKnex,
  createPgFlightQueries,
  createPgWingQueries,
  PgFlightRepo,
  PgPilotRepo,
  PgWingRepo,
} from "@paralogs/logbook/secondary-adapters";

import { flightMapper } from "@paralogs/logbook/domain";
import { wingMapper } from "@paralogs/logbook/domain";
import { ENV, EventBusOption, RepositoriesOption } from "@paralogs/back/shared";

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
