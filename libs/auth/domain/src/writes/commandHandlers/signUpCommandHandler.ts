import {
  CurrentUserWithAuthToken,
  SignUpParams,
} from "@paralogs/auth/interface";
import {
  combineEithers,
  EventBus,
  PersonName,
  ResultAsync,
} from "@paralogs/shared/back";
import { liftEither } from "purify-ts/EitherAsync";
import { UserEntity } from "../entities/UserEntity";
import { Hasher } from "../gateways/Hasher";
import { TokenManager } from "../gateways/TokenManager";
import { UserRepo } from "../gateways/UserRepo";
import { userMapper } from "../mappers/user.mapper";
import { Email } from "../valueObjects/Email";
import { Password } from "../valueObjects/Password";

interface SignUpDependencies {
  userRepo: UserRepo;
  hasher: Hasher;
  tokenManager: TokenManager;
  eventBus: EventBus;
}

export const signUpCommandHandler = ({
  userRepo,
  eventBus,
  hasher,
  tokenManager,
}: SignUpDependencies) => (
  signUpParams: SignUpParams,
): ResultAsync<CurrentUserWithAuthToken> =>
  validateSignUpParams(signUpParams, hasher)
    .map((params) => UserEntity.create(params, { tokenManager }))
    .chain((userEntity) => userRepo.save(userEntity).map(() => userEntity))
    .map((savedUserEntity) => {
      const userDTO = userMapper.entityToDTO(savedUserEntity);
      eventBus.publish({ type: "UserSignedUp", payload: userDTO });
      return {
        token: savedUserEntity.getProps().authToken,
        currentUser: userDTO,
      };
    });

const validateSignUpParams = (
  { email, firstName, lastName, password, uuid }: SignUpParams,
  hasher: Hasher,
) =>
  liftEither(
    combineEithers({
      email: Email.create(email),
      firstName: PersonName.create(firstName),
      lastName: PersonName.create(lastName),
    }),
  ).chain((params) => {
    return Password.create(password, hasher).map((password) => ({
      uuid,
      password,
      ...params,
    }));
  });

export type SignUpCommandHandler = ReturnType<typeof signUpCommandHandler>;
