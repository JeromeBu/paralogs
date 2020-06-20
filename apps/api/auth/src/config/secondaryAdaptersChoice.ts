import {
  createInMemoryEventBus,
  createRedisEventBus,
  EventBus,
} from "@paralogs/shared/back";
import { List } from "purify-ts";
import { liftMaybe } from "purify-ts/MaybeAsync";

import {
  createPgUserQueries,
  PgUserRepo,
} from "@paralogs/auth/secondary-adapters";
import {
  getKnex,
  WebpackAuthMigrationSource,
} from "@paralogs/auth/secondary-adapters";
import { ENV, EventBusOption, RepositoriesOption } from "@paralogs/shared/back";
import {
  UserQueries,
  UserRepo,
  userMapper,
  InMemoryUserRepo,
} from "@paralogs/auth/domain";

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
  if (ENV.nodeEnv !== "test") {
    knex.migrate.latest({
      migrationSource: new WebpackAuthMigrationSource(),
    });
  }
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
