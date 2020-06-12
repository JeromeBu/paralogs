import { FlightDTO, PilotUuid } from "@paralogs/shared";

export interface FlightQueries {
  findByPilotUuid: (pilotUuid: PilotUuid) => Promise<FlightDTO[]>;
}
