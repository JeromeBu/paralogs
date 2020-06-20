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

// export const getCurrentUserReadCreator = ({ userRepo }: GetMeDependencies) => ({
//   userUuid,
// }: WithUserUuid): ResultAsync<CurrentUserWithAuthToken> => {
//   return userRepo
//     .findByUuid(userUuid)
//     .map((userEntity) => {
//       const userDTO = userMapper.entityToDTO(userEntity);
//       return {
//         currentUser: userDTO,
//         token: userEntity.getProps().authToken,
//       };
//     })
//     .toEitherAsync(notFoundError(`No user found with id : ${userUuid}`));
// };
