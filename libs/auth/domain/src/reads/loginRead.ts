import {
  AppError,
  LeftAsync,
  notFoundError,
  ResultAsync,
  RightAsync,
  validationError,
} from "@paralogs/shared/back";
import {
  CurrentUserWithAuthToken,
  LoginParams,
} from "@paralogs/auth/interface";
import { liftEither, liftPromise } from "purify-ts/EitherAsync";
import { Hasher } from "..";
import { UserRepo } from "../writes/gateways/UserRepo";
import { userMapper } from "../writes/mappers/user.mapper";
import { Email } from "../writes/valueObjects/Email";

interface LoginDependencies {
  userRepo: UserRepo;
  hasher: Hasher;
}

export const loginRead = ({ userRepo, hasher }: LoginDependencies) => (
  params: LoginParams,
): ResultAsync<CurrentUserWithAuthToken> =>
  liftEither(Email.create(params.email)).chain((email) =>
    userRepo
      .findByEmail(email)
      .toEitherAsync(notFoundError("No user found with this email"))
      .chain((userEntity) =>
        liftPromise<boolean, AppError>(() =>
          userEntity.checkPassword(params.password, hasher),
        ).chain((isPasswordCorrect) => {
          if (!isPasswordCorrect)
            return LeftAsync(validationError("Wrong password"));
          return RightAsync({
            token: userEntity.getProps().authToken,
            currentUser: userMapper.entityToDTO(userEntity),
          });
        }),
      ),
  );
