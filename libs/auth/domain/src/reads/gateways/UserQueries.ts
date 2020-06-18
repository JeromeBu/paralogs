import { CurrentUserWithAuthToken, UserUuid } from "@paralogs/auth/interface";
import { MaybeAsync } from "purify-ts";

export interface UserQueries {
  findByUuidWithToken(uuid: UserUuid): MaybeAsync<CurrentUserWithAuthToken>;
}
