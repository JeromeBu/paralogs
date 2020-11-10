import {
  EventBus,
  notFoundError,
  ResultAsync,
  RightAsyncVoid,
} from "@paralogs/shared/back";
import { UpdateUserDTO, WithUuid } from "@paralogs/auth/interface";
import { EitherAsync } from "purify-ts";

import { UserRepo } from "../gateways/UserRepo";
import { userMapper } from "../mappers/user.mapper";

type UpdateUserDependencies = {
  userRepo: UserRepo;
  eventBus: EventBus;
};

export const updateUserCommandHandler = ({
  userRepo,
  eventBus,
}: UpdateUserDependencies) => (
  params: UpdateUserDTO & WithUuid,
): ResultAsync<void> => {
  return userRepo
    .findByUuid(params.uuid)
    .toEitherAsync(notFoundError(`No pilot found with this id: ${params.uuid}`))
    .chain((userEntity) => EitherAsync.liftEither(userEntity.update(params)))
    .chain((userToSave) =>
      userRepo.save(userToSave).chain(() => {
        eventBus.publish({
          type: "UserUpdated",
          payload: userMapper.entityToDTO(userToSave),
        });
        return RightAsyncVoid();
      }),
    );
};
