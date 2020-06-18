import { Persisted } from "@paralogs/back/shared";
import { FlightUuid, PilotUuid, WingUuid } from "@paralogs/logbook/interfaces";

export interface FlightPersistence {
  id?: number;
  uuid: FlightUuid;
  pilot_uuid: PilotUuid;
  pilot_id?: number;
  wing_uuid: WingUuid;
  wing_id?: number;
  date: string;
  time: string | null;
  site: string;
  duration: number;
}

export type FlightPersisted = Persisted<FlightPersistence>;
