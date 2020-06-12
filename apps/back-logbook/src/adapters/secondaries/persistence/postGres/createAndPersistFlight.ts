import { FlightDTO, RequireField } from "@paralogs/shared";
import Knex from "knex";

import { makeFlightEntity } from "../../../../domain/writes/testBuilders/makeFlightEntity";
import { FlightPersistence } from "./flights/FlightPersistence";
import { flightPersistenceMapper } from "./flights/flightPersistenceMapper";
import { PilotPersisted } from "./pilots/PilotPersistence";
import { WingPersistence } from "./wings/WingPersistence";

export const createAndPersistFlight = async (
  knex: Knex<any, unknown[]>,
  flightParams: RequireField<Partial<FlightDTO>, "pilotUuid" | "wingUuid">,
) => {
  const flightEntity = await makeFlightEntity(flightParams);
  const pilot = await knex
    .from<PilotPersisted>("pilots")
    .select("id")
    .where({ uuid: flightEntity.getProps().pilotUuid })
    .first();
  if (!pilot)
    throw new Error(
      "Please provide an existing Pilot, cannot create wing linked to no Pilot",
    );
  const wing = await knex
    .from<WingPersistence>("wings")
    .select("id")
    .where({ uuid: flightEntity.getProps().wingUuid })
    .first();
  if (!wing)
    throw new Error(
      "Please provide an existing Wing, cannot create flight linked to no Wing",
    );
  const flightPersistence = flightPersistenceMapper.toPersistence(flightEntity);

  await knex<FlightPersistence>("flights")
    .insert({ ...flightPersistence, pilot_id: pilot.id, wing_id: wing.id })
    .returning("id");
  return flightPersistenceMapper.toDTO(flightPersistence);
};
