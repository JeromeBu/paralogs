import { ResultAsync } from "@paralogs/back/shared";
import { PilotUuid } from "@paralogs/shared";
import { MaybeAsync } from "purify-ts";

import { PilotEntity } from "../entities/PilotEntity";

export interface PilotRepo {
  findByUuid: (id: PilotUuid) => MaybeAsync<PilotEntity>;
  save: (userEntity: PilotEntity) => ResultAsync<void>;
}
