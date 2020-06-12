import {
  createInMemoryEventBus,
  createRedisEventBus,
  EventBus,
} from "@paralogs/back-shared";
import { List } from "purify-ts";
import { liftMaybe } from "purify-ts/MaybeAsync";

import { InMemoryUserRepo } from "../adapters/secondaries/persistence/inMemory/InMemoryUserRepo";
import { getKnex } from "../adapters/secondaries/persistence/postGres/knex/db";
import { createPgUserQueries } from "../adapters/secondaries/persistence/postGres/users/PgUserQueries";
import { PgUserRepo } from "../adapters/secondaries/persistence/postGres/users/PgUserRepo";
import { UserQueries } from "../domain/reads/gateways/UserQueries";
import { UserRepo } from "../domain/writes/gateways/UserRepo";
import { userMapper } from "../domain/writes/mappers/user.mapper";
import { ENV, EventBusOption, RepositoriesOption } from "./env";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const shouldNeverBeCalled = (arg: never) => {
  throw new Error("Should never be called");
};

interface Repositories {
  user: UserRepo;
}

interface Queries {
  user: UserQueries;
}

interface Persistence {
  repositories: Repositories;
  queries: Queries;
}

const getInMemoryPersistence = (): Persistence => {
  const userRepo = new InMemoryUserRepo();
  return {
    repositories: {
      user: userRepo,
    },
    queries: {
      user: {
        findByUuidWithToken: (userUuid) =>
          liftMaybe(
            List.find(({ uuid }) => uuid === userUuid, userRepo.users),
          ).map((userEntity) => ({
            currentUser: userMapper.entityToDTO(userEntity),
            token: userEntity.getProps().authToken,
          })),
      },
    },
  };
};

const getPgPersistence = (): Persistence => {
  const knex = getKnex(ENV.nodeEnv);
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  if (ENV.nodeEnv !== "test") knex.migrate.latest();
  return {
    repositories: {
      user: new PgUserRepo(knex),
    },
    queries: { user: createPgUserQueries(knex) },
  };
};

const getRepositoriesAndQueries = (
  repositories: RepositoriesOption,
): Persistence => {
  switch (repositories) {
    case "IN_MEMORY":
      return getInMemoryPersistence();
    case "PG":
      return getPgPersistence();
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
