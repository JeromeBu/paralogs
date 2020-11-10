import {
  checkNotExists,
  notUniqError,
  ResultAsync,
} from "@paralogs/shared/back";
import { WingDTO } from "@paralogs/logbook/interfaces";
import { EitherAsync } from "purify-ts";

import { WingEntity } from "../../entities/WingEntity";
import { WingRepo } from "../../gateways/WingRepo";

interface AddWingDependencies {
  wingRepo: WingRepo;
}

export const addWingCommandHandlerCreator = ({
  wingRepo,
}: AddWingDependencies) => (wingDTO: WingDTO): ResultAsync<WingDTO> => {
  const maybeAsyncWingDto = wingRepo.findByUuid(wingDTO.uuid);

  const eitherAsyncNotExists = checkNotExists(
    maybeAsyncWingDto,
    notUniqError("Cannot create wing. A wing with this uuid already exists"),
  );

  return eitherAsyncNotExists
    .chain(() => EitherAsync.liftEither(WingEntity.create(wingDTO)))
    .chain((wingEntity) => wingRepo.save(wingEntity).map(() => wingDTO));
};

export type AddWingCommandHandler = ReturnType<
  typeof addWingCommandHandlerCreator
>;
