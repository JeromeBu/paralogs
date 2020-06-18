import { ResultAsync } from "@paralogs/back/shared";
import { PilotUuid, WingUuid } from "@paralogs/shared";
import { MaybeAsync } from "purify-ts";

import { WingEntity } from "../entities/WingEntity";

export interface WingRepo {
  findByUuid: (id: WingUuid) => MaybeAsync<WingEntity>;
  findByPilotUuid: (userUuid: PilotUuid) => Promise<WingEntity[]>;
  save: (wing: WingEntity) => ResultAsync<void>;
}
