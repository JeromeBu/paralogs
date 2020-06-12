import { RequireField, WingDTO } from "@paralogs/shared";
import Knex from "knex";

import { makeWingEntity } from "../../../../domain/writes/testBuilders/makeWingEntity";
import { PilotPersisted } from "./pilots/PilotPersistence";
import { WingPersistence } from "./wings/WingPersistence";
import { wingPersistenceMapper } from "./wings/wingPersistenceMapper";

export const createAndPersistWing = async (
  knex: Knex<any, unknown[]>,
  wingParams: RequireField<Partial<WingDTO>, "pilotUuid">,
) => {
  const wingEntity = await makeWingEntity(wingParams);
  const pilot = await knex
    .from<PilotPersisted>("pilots")
    .select("id")
    .where({ uuid: wingEntity.getProps().pilotUuid })
    .first();
  if (!pilot)
    throw new Error(
      "Please provide an existing Pilot, cannot create wing linked to no Pilot",
    );
  const wingPersistence = wingPersistenceMapper.toPersistence(wingEntity);

  await knex<WingPersistence>("wings")
    .insert({ ...wingPersistence, pilot_id: pilot.id })
    .returning("id");
  return wingPersistenceMapper.toDTO(wingPersistence);
};
