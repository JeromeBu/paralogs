/**
 * @group http
 * @group integration
 */

import { callUseCase, RightAsync } from "@paralogs/shared/back";
import {
  AddFlightDTO,
  AddWingDTO,
  flightsRoute,
  wingsRoute,
  WingUuid,
} from "@paralogs/logbook/interfaces";
import {
  getSupertestRequest,
  SupertestRequest,
} from "@paralogs/shared/back-test-helpers";
import { generateUuid } from "@paralogs/shared/common";
import jwt from "jsonwebtoken";

import { ENV } from "@paralogs/shared/back";
import { pilotsUseCases } from "../config/useCasesChoice";
import { getKnex, resetDb } from "@paralogs/logbook/secondary-adapters";
import { configureServer } from "../express/server";

describe("Flights routes", () => {
  const pilot = {
    uuid: generateUuid(),
    firstName: "John Wing",
    lastName: "Doe Wing",
  };
  const token = jwt.sign({ userUuid: pilot.uuid }, ENV.jwtSecret);
  const knex = getKnex(ENV.nodeEnv);
  let request: SupertestRequest;

  beforeAll(async () => {
    if (ENV.nodeEnv !== "test") throw new Error("Should be TEST env");
    request = await getSupertestRequest(configureServer);
    await resetDb(knex);
    await callUseCase({
      useCase: await pilotsUseCases.create,
      eitherAsyncParams: RightAsync(pilot),
    });
  });

  afterAll(() => knex.destroy());

  const brand = "Nova";
  const model = "Ion 5";
  const wingUuid: WingUuid = generateUuid();
  const addWingParams: AddWingDTO = {
    uuid: wingUuid,
    brand,
    model,
    ownerFrom: new Date("2020-03-03").toUTCString(),
    flightTimePriorToOwn: 500,
  };

  it("adds a flight then retrieves it", async () => {
    await request
      .post(wingsRoute)
      .send(addWingParams)
      .set("Authorization", `Bearer ${token}`);

    const addFlightParams: AddFlightDTO = {
      uuid: generateUuid(),
      date: new Date("2020-04-04").toUTCString(),
      duration: 35,
      site: "La scia",
      time: "15h35",
      wingUuid,
    };

    await request
      .post(flightsRoute)
      .send(addFlightParams)
      .set("Authorization", `Bearer ${token}`);

    const retrievedFlights = await request
      .get(flightsRoute)
      .set("Authorization", `Bearer ${token}`);

    expect(retrievedFlights.body).toMatchObject([addFlightParams]);
  });
});
