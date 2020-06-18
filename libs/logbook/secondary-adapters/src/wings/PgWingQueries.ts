import { WingQueries } from "@paralogs/logbook/domain";
import { PilotUuid, WingDTO } from "@paralogs/logbook/interfaces";
import Knex from "knex";

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
