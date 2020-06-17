import {
  AppError,
  LeftAsync,
  notFoundError,
  ResultAsync,
  RightAsync,
  validationError,
} from "@paralogs/back/shared";
import {
  CurrentUserWithAuthToken,
  LoginParams,
} from "@paralogs/auth/interface";
import { liftEither, liftPromise } from "purify-ts/EitherAsync";

import { HashAndTokenManager } from "../writes/gateways/HashAndTokenManager";
import { UserRepo } from "../writes/gateways/UserRepo";
import { userMapper } from "../writes/mappers/user.mapper";
import { Email } from "../writes/valueObjects/user/Email";

interface LoginDependencies {
  userRepo: UserRepo;
  hashAndTokenManager: HashAndTokenManager;
}

export const loginReadCreator = ({
  userRepo,
  hashAndTokenManager,
}: LoginDependencies) => (
  params: LoginParams,
): ResultAsync<CurrentUserWithAuthToken> => {
  return liftEither(Email.create(params.email)).chain((email) => {
    return userRepo
      .findByEmail(email)
      .toEitherAsync(notFoundError("No user found with this email"))
      .chain((userEntity) =>
        liftPromise<boolean, AppError>(() =>
          userEntity.checkPassword(params.password, { hashAndTokenManager }),
        ).chain((isPasswordCorrect) => {
          if (!isPasswordCorrect)
            return LeftAsync(validationError("Wrong password"));
          return RightAsync({
            token: userEntity.getProps().authToken,
            currentUser: userMapper.entityToDTO(userEntity),
          });
        }),
      );
  });
};

export type LoginRead = ReturnType<typeof loginReadCreator>;
