/**
 * @group pg
 * @group integration
 */

import { PilotDTO, PilotUuid } from "@paralogs/logbook/interfaces";
import { generateUuid } from "@paralogs/shared";

import { createAndPersistPilot } from "../createAndPersistPilot";
import { createAndPersistWing } from "../createAndPersistWing";
import { getKnex, resetDb } from "../knex/db";
import { createPgWingQueries } from "./PgWingQueries";

describe("Pg wing queries", () => {
  const knex = getKnex("test");
  let pgWingQueries: ReturnType<typeof createPgWingQueries>;
  let johnDto: PilotDTO;
  let johnUuid: PilotUuid;

  beforeEach(async () => {
    await resetDb(knex);
    pgWingQueries = createPgWingQueries(knex);
    johnUuid = generateUuid();
    johnDto = await createAndPersistPilot(knex, {
      uuid: johnUuid,
      firstName: "John",
    });
  });

  afterAll(() => knex.destroy());

  it("returns empty array when no wing is found", async () => {
    const foundWings = await pgWingQueries.findByPilotUuid("not found id");
    expect(foundWings).toEqual([]);
  });

  it("finds only wings from the provided pilot", async () => {
    await createAndPersistWing(knex, { pilotUuid: johnUuid });
    const foundWings = await pgWingQueries.findByPilotUuid("not john id");
    expect(foundWings).toEqual([]);
  });

  it("finds a pilot wings from its uuid", async () => {
    const johnWing = await createAndPersistWing(knex, { pilotUuid: johnUuid });
    const foundWings = await pgWingQueries.findByPilotUuid(johnDto.uuid);
    expect(foundWings).toEqual([johnWing]);
  });
});
