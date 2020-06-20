import { Persisted } from "@paralogs/shared/back";
import { PilotUuid } from "@paralogs/logbook/interfaces";

export type PilotPersistence = {
  id?: number;
  uuid: PilotUuid;
  first_name: string;
  last_name?: string;
};

export type PilotPersisted = Persisted<PilotPersistence>;
