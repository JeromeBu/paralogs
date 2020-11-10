import { notFoundError, ResultAsync } from "@paralogs/shared/back";
import { UpdatePilotDTO } from "@paralogs/logbook/interfaces";
import { EitherAsync } from "purify-ts";

import { PilotRepo } from "../../gateways/PilotRepo";

type UpdatePilotDependencies = {
  pilotRepo: PilotRepo;
};

type UpdatePilotParams = UpdatePilotDTO;

export const updatePilotCommandHandlerCreator = ({
  pilotRepo,
}: UpdatePilotDependencies) => (
  params: UpdatePilotParams,
): ResultAsync<void> => {
  return pilotRepo
    .findByUuid(params.uuid)
    .toEitherAsync(notFoundError(`No pilot found with this id: ${params.uuid}`))
    .chain((currentPilot) =>
      EitherAsync.liftEither(currentPilot.update(params)),
    )
    .chain((pilotToSave) => pilotRepo.save(pilotToSave));
};

export type UpdatePilotCommandHandler = ReturnType<
  typeof updatePilotCommandHandlerCreator
>;
