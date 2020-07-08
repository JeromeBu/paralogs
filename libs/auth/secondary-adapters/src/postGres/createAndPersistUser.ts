import {
  makeUserEntityCreator,
  TestTokenManager,
  TestHasher,
} from "@paralogs/auth/domain";
import { SignUpParams, UserDTO } from "@paralogs/auth/interface";
import Knex from "knex";
import { UserPersistence } from "./users/UserPersistence";
import { userPersistenceMapper } from "./users/userPersistenceMapper";

export const createAndPersistUser = async (
  knex: Knex<any, unknown[]>,
  userParams?: Partial<SignUpParams & { id: number }>,
): Promise<UserDTO> => {
  const makeUserEntity = makeUserEntityCreator({
    tokenManager: new TestTokenManager(),
    hasher: new TestHasher(),
  });
  const userEntity = await makeUserEntity(userParams);
  const userPersistence = userPersistenceMapper.toPersistence(userEntity);
  await knex<UserPersistence>("users").insert(userPersistence);
  return userPersistenceMapper.toDTO(userPersistence);
};
