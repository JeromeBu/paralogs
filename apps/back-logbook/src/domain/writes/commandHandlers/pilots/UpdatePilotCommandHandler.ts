import { notFoundError, ResultAsync } from "@paralogs/back/shared";
import { UpdatePilotDTO } from "@paralogs/shared";
import { liftEither } from "purify-ts/EitherAsync";

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
    .chain((currentPilot) => liftEither(currentPilot.update(params)))
    .chain((pilotToSave) => pilotRepo.save(pilotToSave));
};

export type UpdatePilotCommandHandler = ReturnType<
  typeof updatePilotCommandHandlerCreator
>;
