import { PilotUuid, WingDTO } from "@paralogs/shared";

export interface WingQueries {
  findByPilotUuid: (pilotUuid: PilotUuid) => Promise<WingDTO[]>;
}
