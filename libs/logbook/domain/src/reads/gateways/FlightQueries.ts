import { FlightDTO, PilotUuid } from "@paralogs/logbook/interfaces";

export interface FlightQueries {
  findByPilotUuid: (pilotUuid: PilotUuid) => Promise<FlightDTO[]>;
}
