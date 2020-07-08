import { notFoundError, ResultAsync } from "@paralogs/shared/back";
import {
  CurrentUserWithAuthToken,
  WithUserUuid,
} from "@paralogs/auth/interface";

import { UserQueries } from "./gateways/UserQueries";

interface GetMeDependencies {
  userQueries: UserQueries;
}

export const getCurrentUserReadCreator = ({
  userQueries,
}: GetMeDependencies) => ({
  userUuid,
}: WithUserUuid): ResultAsync<CurrentUserWithAuthToken> => {
  return userQueries
    .findByUuidWithToken(userUuid)
    .toEitherAsync(notFoundError(`No user found with id : ${userUuid}`));
};
