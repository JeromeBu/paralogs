import { PilotUuid, WingDTO } from "@paralogs/logbook/interfaces";

export interface WingQueries {
  findByPilotUuid: (pilotUuid: PilotUuid) => Promise<WingDTO[]>;
}
