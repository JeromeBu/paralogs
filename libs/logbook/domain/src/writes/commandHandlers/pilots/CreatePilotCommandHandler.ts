import { RightAsyncVoid } from "@paralogs/shared/back";
import { PilotDTO } from "@paralogs/logbook/interfaces";
import { EitherAsync } from "purify-ts";

import { PilotEntity } from "../../entities/PilotEntity";
import { PilotRepo } from "../../gateways/PilotRepo";

export type CreatePilotDependencies = {
  pilotRepo: PilotRepo;
};

export const createPilotCommandHandlerCreator = ({
  pilotRepo,
}: CreatePilotDependencies) => (params: PilotDTO) =>
  EitherAsync.liftEither(PilotEntity.create(params))
    .chain((p) => pilotRepo.save(p))
    .map(RightAsyncVoid);
