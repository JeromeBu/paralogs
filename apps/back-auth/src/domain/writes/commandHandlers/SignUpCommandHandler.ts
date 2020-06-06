import { EventBus, ResultAsync } from "@paralogs/back-shared";
import {
  CurrentUserWithAuthToken,
  SignUpParams,
  UuidGenerator,
} from "@paralogs/shared";

import { UserEntity } from "../entities/UserEntity";
import { HashAndTokenManager } from "../gateways/HashAndTokenManager";
import { UserRepo } from "../gateways/UserRepo";
import { userMapper } from "../mappers/user.mapper";

interface SignUpDependencies {
  userRepo: UserRepo;
  uuidGenerator: UuidGenerator;
  hashAndTokenManager: HashAndTokenManager;
  eventBus: EventBus;
}

export const signUpCommandHandlerCreator = ({
  userRepo,
  uuidGenerator,
  hashAndTokenManager,
  eventBus,
}: SignUpDependencies) => (
  signUpParams: SignUpParams,
): ResultAsync<CurrentUserWithAuthToken> => {
  return UserEntity.create(
    {
      ...signUpParams,
      uuid: uuidGenerator.generate(),
    },
    { hashAndTokenManager },
  )
    .chain((userEntity) => userRepo.save(userEntity).map(() => userEntity))
    .map((savedUserEntity) => {
      const userDTO = userMapper.entityToDTO(savedUserEntity);
      eventBus.publish({ type: "UserSignedUp", payload: userDTO });
      return {
        token: savedUserEntity.getProps().authToken,
        currentUser: userDTO,
      };
    });
};

export type SignUpCommandHandler = ReturnType<
  typeof signUpCommandHandlerCreator
>;
