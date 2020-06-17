/**
 * @group pg
 * @group integration
 */

import {
  expectEitherToMatchError,
  expectRight,
} from "@paralogs/back/test-helpers";
import { generateUuid, UpdateWingDTO } from "@paralogs/shared";

import { PilotEntity } from "../../../../../domain/writes/entities/PilotEntity";
import { WingEntity } from "../../../../../domain/writes/entities/WingEntity";
import { WingRepo } from "../../../../../domain/writes/gateways/WingRepo";
import { makePilotEntity } from "../../../../../domain/writes/testBuilders/makePilotEntity";
import { makeWingEntity } from "../../../../../domain/writes/testBuilders/makeWingEntity";
import { getKnex, resetDb } from "../knex/db";
import { PilotPersistence } from "../pilots/PilotPersistence";
import { pilotPersistenceMapper } from "../pilots/pilotPersistenceMapper";
import { PgWingRepo } from "./PgWingRepo";
import { WingPersistence } from "./WingPersistence";
import { wingPersistenceMapper } from "./wingPersistenceMapper";

describe("Wing repository postgres tests", () => {
  let pgWingRepo: WingRepo;
  const knex = getKnex("test");
  let johnEntity: PilotEntity;
  let koyotWingEntity: WingEntity;

  beforeEach(async () => {
    await resetDb(knex);
    pgWingRepo = new PgWingRepo(knex);
    johnEntity = await makePilotEntity({ firstName: "John", pilotId: 125 });

    await knex<PilotPersistence>("pilots").insert(
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
    koyotWingEntity = wingPersistenceMapper.toEntity(koyotWingPersistence);
  });

  afterAll(() => knex.destroy());

  it("fails to create a wing when pilotUuid does not exist", async () => {
    const wingEntity = makeWingEntity({ pilotUuid: generateUuid() });
    const result = await pgWingRepo.save(wingEntity).run();
    expectEitherToMatchError(result, "No pilot matched this pilotUuid");
  });

  it("creates a wing", async () => {
    const wingEntity = makeWingEntity({ pilotUuid: johnEntity.uuid });
    const result = await pgWingRepo.save(wingEntity).run();
    expectRight(result);
    const {
      uuid,
      pilotUuid,
      brand,
      model,
      flightTimePriorToOwn,
      ownerFrom,
    } = wingEntity.getProps();

    const wingPersistenceToMatch: WingPersistence = {
      id: 1,
      uuid,
      pilot_uuid: pilotUuid,
      brand,
      model,
      flight_time_prior_to_own: flightTimePriorToOwn,
      owner_from: ownerFrom,
      owner_until: null,
    };

    expect(
      await knex<WingPersistence>("wings").where({ uuid }).first(),
    ).toMatchObject(wingPersistenceToMatch);
  });

  it("gets a wing from it's id", async () => {
    const foundWing = await pgWingRepo.findByUuid(koyotWingEntity.uuid).run();
    expect(foundWing.extract()).toEqual(koyotWingEntity);
  });

  it("gets all the wings that belong to a pilot", async () => {
    const foundWing = await pgWingRepo.findByPilotUuid(johnEntity.uuid);
    expect(foundWing).toEqual([koyotWingEntity]);
  });

  it("updates the wing", async () => {
    const wingToUpdate = (
      await pgWingRepo.findByUuid(koyotWingEntity.uuid).run()
    ).extract()!;
    const updateParams: UpdateWingDTO = {
      uuid: koyotWingEntity.uuid,
      model: "new model name",
      brand: "new brand",
      flightTimePriorToOwn: 25,
      ownerFrom: "2015",
      ownerUntil: "2030",
    };
    await pgWingRepo.save(wingToUpdate.update(updateParams)).run();
    const updatedWing = (
      await pgWingRepo.findByUuid(koyotWingEntity.uuid).run()
    ).extract()!;
    expect(updatedWing.getProps()).toEqual({
      uuid: koyotWingEntity.uuid,
      pilotUuid: koyotWingEntity.pilotUuid,
      model: updateParams.model,
      brand: updateParams.brand,
      flightTimePriorToOwn: updateParams.flightTimePriorToOwn,
      ownerFrom: updateParams.ownerFrom,
      ownerUntil: updateParams.ownerUntil,
    });
  });
});
