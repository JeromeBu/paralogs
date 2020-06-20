import { EventBus, ResultAsync } from "@paralogs/shared/back";
import { UuidGenerator } from "@paralogs/shared/common";
import {
  CurrentUserWithAuthToken,
  SignUpParams,
} from "@paralogs/auth/interface";

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

export const signUpCommandHandler = ({
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

export type SignUpCommandHandler = ReturnType<typeof signUpCommandHandler>;
