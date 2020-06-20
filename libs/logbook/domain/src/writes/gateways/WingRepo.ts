import { ResultAsync } from "@paralogs/shared/back";
import { PilotUuid, WingUuid } from "@paralogs/logbook/interfaces";
import { MaybeAsync } from "purify-ts";

import { WingEntity } from "../entities/WingEntity";

export interface WingRepo {
  findByUuid: (id: WingUuid) => MaybeAsync<WingEntity>;
  findByPilotUuid: (userUuid: PilotUuid) => Promise<WingEntity[]>;
  save: (wing: WingEntity) => ResultAsync<void>;
}
