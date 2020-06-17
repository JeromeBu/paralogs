/**
 * @group pg
 * @group integration
 */

import { generateUuid } from "@paralogs/shared";
import { PilotUuid, WingUuid } from "@paralogs/logbook/interfaces";

import { createAndPersistFlight } from "../createAndPersistFlight";
import { createAndPersistPilot } from "../createAndPersistPilot";
import { createAndPersistWing } from "../createAndPersistWing";
import { getKnex, resetDb } from "../knex/db";
import { createPgFlightQueries } from "./PgFlightQueries";

describe("Pg flight queries", () => {
  const knex = getKnex("test");
  let pgFlightQueries: ReturnType<typeof createPgFlightQueries>;
  let johnUuid: PilotUuid;
  let ion5Uuid: WingUuid;

  beforeEach(async () => {
    await resetDb(knex);
    pgFlightQueries = createPgFlightQueries(knex);
    johnUuid = generateUuid();
    await createAndPersistPilot(knex, {
      uuid: johnUuid,
      firstName: "John",
    });
    ion5Uuid = generateUuid();
    await createAndPersistWing(knex, {
      uuid: ion5Uuid,
      pilotUuid: johnUuid,
      brand: "Nova",
      model: "Ion 5",
    });
  });

  afterAll(() => knex.destroy());

  it("returns empty array when no flight is found", async () => {
    const foundFlights = await pgFlightQueries.findByPilotUuid(johnUuid);
    expect(foundFlights).toEqual([]);
  });

  it("finds only flight from the provided pilot", async () => {
    const anotherPilotUuid = generateUuid();

    await createAndPersistPilot(knex, {
      uuid: anotherPilotUuid,
    });
    const wingDto = await createAndPersistWing(knex, {
      pilotUuid: anotherPilotUuid,
    });
    await createAndPersistFlight(knex, {
      pilotUuid: anotherPilotUuid,
      wingUuid: wingDto.uuid,
    });

    const johnFlight = await createAndPersistFlight(knex, {
      pilotUuid: johnUuid,
      wingUuid: ion5Uuid,
    });
    const foundFlights = await pgFlightQueries.findByPilotUuid(johnUuid);
    expect(foundFlights).toEqual([johnFlight]);
  });
});
