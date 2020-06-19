import { fromNullablePromiseCb } from "@paralogs/back/shared";
import { UserUuid } from "@paralogs/auth/interface";
import Knex from "knex";
import { UserQueries } from "@paralogs/auth/domain";

import { UserPersisted } from "./UserPersistence";
import { userPersistenceMapper } from "./userPersistenceMapper";

export const createPgUserQueries = (
  knex: Knex<any, unknown[]>,
): UserQueries => {
  return {
    findByUuidWithToken: (uuid: UserUuid) =>
      fromNullablePromiseCb(() =>
        knex.from<UserPersisted>("users").where({ uuid }).first(),
      ).map((userPersisted) => ({
        currentUser: userPersistenceMapper.toDTO(userPersisted),
        token: userPersisted.auth_token,
      })),
  };
};
