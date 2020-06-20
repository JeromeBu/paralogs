import { ResultAsync } from "@paralogs/shared/back";
import { PilotUuid } from "@paralogs/logbook/interfaces";
import { MaybeAsync } from "purify-ts";

import { PilotEntity } from "../entities/PilotEntity";

export interface PilotRepo {
  findByUuid: (id: PilotUuid) => MaybeAsync<PilotEntity>;
  save: (userEntity: PilotEntity) => ResultAsync<void>;
}
