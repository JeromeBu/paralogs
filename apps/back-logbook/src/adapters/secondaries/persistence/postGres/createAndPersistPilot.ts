import { PilotDTO } from "@paralogs/shared";
import Knex from "knex";

import { makePilotEntity } from "../../../../domain/writes/testBuilders/makePilotEntity";
import { PilotPersistence } from "./pilots/PilotPersistence";
import { pilotPersistenceMapper } from "./pilots/pilotPersistenceMapper";

export const createAndPersistPilot = async (
  knex: Knex<any, unknown[]>,
  pilotParams: Partial<PilotDTO> = {},
) => {
  const pilotEntity = await makePilotEntity(pilotParams);
  const pilotPersistence = pilotPersistenceMapper.toPersistence(pilotEntity);
  await knex<PilotPersistence>("pilots")
    .insert(pilotPersistence)
    .returning("id");
  return pilotPersistenceMapper.toDTO(pilotPersistence);
};
