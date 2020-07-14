/**
 * @group http
 * @group integration
 */

import { callUseCase, RightAsync } from "@paralogs/shared/back";
import {
  getSupertestRequest,
  SupertestRequest,
} from "@paralogs/shared/back-test-helpers";
import { generateUuid } from "@paralogs/shared/common";
import {
  AddWingDTO,
  UpdateWingDTO,
  wingsRoute,
} from "@paralogs/logbook/interfaces";
import jwt from "jsonwebtoken";
import { ENV } from "@paralogs/shared/back";
import { pilotsUseCases } from "../config/useCasesChoice";
import { getKnex, resetDb } from "@paralogs/logbook/secondary-adapters";
import { configureServer } from "../express/server";

describe("Wings routes", () => {
  let request: SupertestRequest;
  const knex = getKnex(ENV.nodeEnv);
  const pilot = {
    uuid: generateUuid(),
    firstName: "John Wing",
    lastName: "Doe Wing",
  };
  const token = jwt.sign({ userUuid: pilot.uuid }, ENV.jwtSecret);

  beforeAll(async () => {
    if (ENV.nodeEnv !== "test") throw new Error("Should be TEST env");
    request = await getSupertestRequest(configureServer);
    await resetDb(knex);
    await callUseCase({
      useCase: pilotsUseCases.create,
      eitherAsyncParams: RightAsync(pilot),
    });
  });

  afterAll(async () => {
    await knex.destroy();
  });

  const brand = "Nova";
  const model = "Ion 5";
  const addWingParams: AddWingDTO = {
    uuid: generateUuid(),
    brand,
    model,
    ownerFrom: new Date().toUTCString(),
    flightTimePriorToOwn: 500,
  };

  it("adds a wing then retrieves it, then updates", async () => {
    await request
      .post(wingsRoute)
      .send(addWingParams)
      .set("Authorization", `Bearer ${token}`);

    const retrievedWings = await request
      .get(wingsRoute)
      .set("Authorization", `Bearer ${token}`);

    expect(retrievedWings.body).toMatchObject([
      {
        brand,
        model,
      },
    ]);
  });

  it("then updates", async () => {
    const updateWingParams: UpdateWingDTO = {
      uuid: addWingParams.uuid,
      brand: "New brand",
      model: "New model2",
      ownerFrom: new Date("2020-04-20").toUTCString(),
    };

    const updateResponse = await request
      .put(wingsRoute)
      .send(updateWingParams)
      .set("Authorization", `Bearer ${token}`);

    expect(updateResponse.body).toBe("");
    expect(updateResponse.status).toBe(200);

    const updatedWings = await request
      .get(wingsRoute)
      .set("Authorization", `Bearer ${token}`);

    expect(updatedWings.body).toMatchObject([
      {
        ...addWingParams,
        ...updateWingParams,
      },
    ]);
  });
});
