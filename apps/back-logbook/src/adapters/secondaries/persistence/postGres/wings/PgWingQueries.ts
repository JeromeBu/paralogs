import { PilotUuid, WingDTO } from "@paralogs/shared";
import Knex from "knex";

import { WingQueries } from "../../../../../domain/reads/gateways/WingQueries";
import { WingPersisted } from "./WingPersistence";
import { wingPersistenceMapper } from "./wingPersistenceMapper";

export const createPgWingQueries = (
  knex: Knex<any, unknown[]>,
): WingQueries => {
  return {
    findByPilotUuid: async (pilot_uuid: PilotUuid): Promise<WingDTO[]> => {
      const persistedWings = await knex
        .from<WingPersisted>("wings")
        .where({ pilot_uuid });
      return persistedWings.map(wingPersistenceMapper.toDTO);
    },
  };
};
