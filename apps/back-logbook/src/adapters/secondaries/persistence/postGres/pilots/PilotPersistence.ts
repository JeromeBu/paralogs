import { Persisted } from "@paralogs/back-shared";
import { PilotUuid } from "@paralogs/shared";

export type PilotPersistence = {
  id?: number;
  uuid: PilotUuid;
  first_name: string;
  last_name?: string;
};

export type PilotPersisted = Persisted<PilotPersistence>;

// Question : comment assurer qu'on a bien toutes les clés dans necessaire dans PilotPersistence au niveau du typage ?
// les clés doivent avoir une correspondance avec les key de PilotEntityProps dans UserEntity
