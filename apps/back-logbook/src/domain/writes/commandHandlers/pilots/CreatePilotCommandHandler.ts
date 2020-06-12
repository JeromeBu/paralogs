import { RightAsyncVoid } from "@paralogs/back-shared";
import { PilotDTO } from "@paralogs/shared";
import { liftEither } from "purify-ts/EitherAsync";

import { PilotEntity } from "../../entities/PilotEntity";
import { PilotRepo } from "../../gateways/PilotRepo";

export type CreatePilotDependencies = {
  pilotRepo: PilotRepo;
};

export const createPilotCommandHandlerCreator = ({
  pilotRepo,
}: CreatePilotDependencies) => (params: PilotDTO) =>
  liftEither(PilotEntity.create(params))
    .chain((p) => pilotRepo.save(p))
    .map(RightAsyncVoid);
