/**
 * @group pg
 * @group integration
 */

import {
  FlightEntity,
  FlightRepo,
  makeFlightEntity,
  makePilotEntity,
  makeWingEntity,
  PilotEntity,
  WingRepo,
} from "@paralogs/logbook/domain";
import { generateUuid } from "@paralogs/shared/common";

import { getKnex, resetDb } from "../knex/db";
import { pilotPersistenceMapper } from "../pilots/pilotPersistenceMapper";
import { PgWingRepo } from "../wings/PgWingRepo";
import { WingPersistence } from "../wings/WingPersistence";
import { FlightPersistence } from "./FlightPersistence";
import { flightPersistenceMapper } from "./flightPersistenceMapper";
import { PgFlightRepo } from "./PgFlightRepo";

describe("Flight repository postgres tests", () => {
  let pgFlightRepo: FlightRepo;
  let pgWingRepo: WingRepo;
  const knex = getKnex("test");
  let johnEntity: PilotEntity;
  let flightEntity: FlightEntity;

  beforeEach(async () => {
    await resetDb(knex);
    pgFlightRepo = new PgFlightRepo(knex);
    pgWingRepo = new PgWingRepo(knex);
    johnEntity = await makePilotEntity({ pilotId: 125, firstName: "John" });
    await knex("pilots").insert(
      pilotPersistenceMapper.toPersistence(johnEntity),
    );

    const koyotWingPersistence: WingPersistence = {
      id: 200,
      uuid: generateUuid(),
      model: "Koyot 2",
      brand: "Niviuk",
      pilot_uuid: johnEntity.uuid,
      pilot_id: johnEntity.getIdentity(),
      flight_time_prior_to_own: 40,
      owner_from: "2020-01-01",
      owner_until: null,
    };

    await knex<WingPersistence>("wings").insert(koyotWingPersistence);

    const flightPersistence: FlightPersistence = {
      id: 300,
      uuid: generateUuid(),
      date: "2020-01-10",
      duration: 123,
      site: "La Scia",
      time: "10h55",
      pilot_uuid: johnEntity.uuid,
      pilot_id: johnEntity.getIdentity(),
      wing_uuid: koyotWingPersistence.uuid,
      wing_id: koyotWingPersistence.id,
    };
    await knex<FlightPersistence>("flights").insert(flightPersistence);
    flightEntity = flightPersistenceMapper.toEntity(flightPersistence);
  });

  afterAll(() => knex.destroy());

  it("creates a flight", async () => {
    const wingEntity = makeWingEntity({ pilotUuid: johnEntity.uuid });
    await pgWingRepo.save(wingEntity).run();
    const createdFlightEntity = makeFlightEntity({
      pilotUuid: johnEntity.uuid,
      wingUuid: wingEntity.uuid,
    });
    await pgFlightRepo.save(createdFlightEntity).run();
    const {
      uuid,
      pilotUuid,
      wingUuid,
      date,
      duration,
      time,
      site,
    } = createdFlightEntity.getProps();

    const flightPersistenceToMatch: Partial<FlightPersistence> = {
      uuid,
      pilot_uuid: pilotUuid,
      wing_uuid: wingUuid,
      date,
      duration,
      time: time ?? null,
      site,
    };

    expect(
      await knex<FlightPersistence>("flights").where({ uuid }).first(),
    ).toMatchObject(flightPersistenceToMatch);
  });

  it("gets a flight from it's id", async () => {
    const foundFlight = await pgFlightRepo.findByUuid(flightEntity.uuid).run();
    expect(foundFlight.extract()).toEqual(flightEntity);
  });

  it("gets all the flights that belong to a pilot", async () => {
    const foundFlight = await pgFlightRepo.findByPilotUuid(johnEntity.uuid);
    expect(foundFlight).toEqual([flightEntity]);
  });
});
