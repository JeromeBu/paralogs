import { SignUpParams, UserDTO } from "@paralogs/auth/interface";
import Knex from "knex";

import { makeUserEntityCreator } from "../../../../domain/writes/testBuilders/makeUserEntityCreator";
import { TestHashAndTokenManager } from "../../TestHashAndTokenManager";
import { UserPersistence } from "./users/UserPersistence";
import { userPersistenceMapper } from "./users/userPersistenceMapper";

export const createAndPersistUser = async (
  knex: Knex<any, unknown[]>,
  userParams?: Partial<SignUpParams & { id: number }>,
): Promise<UserDTO> => {
  const makeUserEntity = makeUserEntityCreator(new TestHashAndTokenManager());
  const userEntity = await makeUserEntity(userParams);
  const userPersistence = userPersistenceMapper.toPersistence(userEntity);
  await knex<UserPersistence>("users").insert(userPersistence);
  return userPersistenceMapper.toDTO(userPersistence);
};
