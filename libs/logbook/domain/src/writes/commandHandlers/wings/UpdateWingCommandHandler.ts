import { notFoundError, ResultAsync } from "@paralogs/shared/back";
import { UpdateWingDTO, WithPilotUuid } from "@paralogs/logbook/interfaces";

import { WingRepo } from "../../gateways/WingRepo";

export interface UpdateWingDependencies {
  wingRepo: WingRepo;
}

export const updateWingCommandHandlerCreator = ({
  wingRepo,
}: UpdateWingDependencies) => (
  wingDTO: UpdateWingDTO & WithPilotUuid,
): ResultAsync<void> =>
  wingRepo
    .findByUuid(wingDTO.uuid)
    .toEitherAsync(notFoundError("No such wing identity found"))
    .chain((wingEntity) => wingRepo.save(wingEntity.update(wingDTO)));

export type UpdateWingCommandHandler = ReturnType<
  typeof updateWingCommandHandlerCreator
>;
