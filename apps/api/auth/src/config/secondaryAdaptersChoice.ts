import {
  createInMemoryEventBus,
  createKafkaEventBus,
  createRedisEventBus,
  EventBus,
} from "@paralogs/shared/back";
import { List, MaybeAsync } from "purify-ts";

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
          MaybeAsync.liftMaybe(
            List.find(({ uuid }) => uuid === userUuid, userRepo.users),
          ).map((userEntity) => ({
            currentUser: userMapper.entityToDTO(userEntity),
            token: userEntity.getProps().authToken,
          })),
      },
    },
  };
};

const getPgPersistence = async (): Promise<Persistence> => {
  const knex = getKnex(ENV.nodeEnv);
  if (ENV.nodeEnv !== "test") {
    await knex.migrate.latest({
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

const selectRepositoriesAndQueries = (
  repositories: RepositoriesOption,
) => async (): Promise<Persistence> => {
  switch (repositories) {
    case "IN_MEMORY":
      return getInMemoryPersistence();
    case "PG":
      return getPgPersistence();
    default:
      return shouldNeverBeCalled(repositories);
  }
};

const selectEventBus = (repositories: EventBusOption) => async (): Promise<
  EventBus
> => {
  switch (repositories) {
    case "IN_MEMORY":
      return createInMemoryEventBus({ getNow: () => new Date() });
    case "REDIS":
      return createRedisEventBus();
    case "KAFKA":
      return createKafkaEventBus();
    default:
      return shouldNeverBeCalled(repositories);
  }
};

export const getRepositoriesAndQueries = selectRepositoriesAndQueries(
  ENV.repositories,
);
export const getEventBus = selectEventBus(ENV.eventBus);
