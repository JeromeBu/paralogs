import { ResultAsync } from "@paralogs/shared/back";
import { FlightUuid, PilotUuid } from "@paralogs/logbook/interfaces";
import { MaybeAsync } from "purify-ts";

import { FlightEntity } from "../entities/FlightEntity";

export interface FlightRepo {
  findByUuid: (id: FlightUuid) => MaybeAsync<FlightEntity>;
  findByPilotUuid: (pilotUuid: PilotUuid) => Promise<FlightEntity[]>;
  save: (FlightEntity: FlightEntity) => ResultAsync<void>;
}
