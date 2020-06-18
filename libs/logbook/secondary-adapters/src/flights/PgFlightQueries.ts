import Knex from "knex";

import { FlightDTO, PilotUuid } from "@paralogs/logbook/interfaces";
import { FlightQueries } from "@paralogs/logbook/domain";

import { FlightPersisted } from "./FlightPersistence";
import { flightPersistenceMapper } from "./flightPersistenceMapper";

export const createPgFlightQueries = (
  knex: Knex<any, unknown[]>,
): FlightQueries => {
  return {
    findByPilotUuid: async (pilot_uuid: PilotUuid): Promise<FlightDTO[]> => {
      const flights = await knex
        .from<FlightPersisted>("flights")
        .where({ pilot_uuid });
      return flights.map(flightPersistenceMapper.toDTO);
    },
  };
};
