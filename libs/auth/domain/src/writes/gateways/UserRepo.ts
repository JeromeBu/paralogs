import { ResultAsync } from "@paralogs/shared/back";
import { UserUuid } from "@paralogs/auth/interface";
import { MaybeAsync } from "purify-ts";

import { UserEntity } from "../entities/UserEntity";
import { Email } from "../valueObjects/Email";

export interface UserRepo {
  findByEmail: (email: Email) => MaybeAsync<UserEntity>;
  findByUuid: (id: UserUuid) => MaybeAsync<UserEntity>;
  save: (userEntity: UserEntity) => ResultAsync<void>;
}
