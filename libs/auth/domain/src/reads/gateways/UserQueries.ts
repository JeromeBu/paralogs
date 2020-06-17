import { CurrentUserWithAuthToken, UserUuid } from "@paralogs/shared";
import { MaybeAsync } from "purify-ts";

export interface UserQueries {
  findByUuidWithToken(uuid: UserUuid): MaybeAsync<CurrentUserWithAuthToken>;
}
