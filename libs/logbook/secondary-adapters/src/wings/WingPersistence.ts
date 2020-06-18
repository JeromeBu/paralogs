import { Persisted } from "@paralogs/back/shared";
import {
  DateString,
  NumberOfMinutes,
  PilotUuid,
  WingUuid,
} from "@paralogs/shared";

export interface WingPersistence {
  id?: number;
  uuid: WingUuid;
  pilot_uuid: PilotUuid;
  pilot_id?: number;
  brand: string;
  model: string;
  owner_from: DateString;
  owner_until: DateString | null;
  flight_time_prior_to_own: NumberOfMinutes;
}

export type WingPersisted = Persisted<WingPersistence>;
