/**
 * @group http
 * @group integration
 */

import {
  getMeRoute,
  LoginParams,
  loginRoute,
  SignUpParams,
  signUpRoute,
  UserUuid,
} from "@paralogs/auth/interface";
import {
  getSupertestRequest,
  SupertestRequest,
} from "@paralogs/shared/back-test-helpers";
import { generateUuid } from "@paralogs/shared/common";
import { getKnex, resetDb } from "@paralogs/auth/secondary-adapters";
import { ENV } from "@paralogs/shared/back";
import { configureServer } from "../express/server";

describe("Authentication routes", () => {
  let request: SupertestRequest;
  beforeAll(async () => {
    request = await getSupertestRequest(configureServer);
    if (ENV.nodeEnv !== "test") throw new Error("Should be TEST env");
    const knex = getKnex(ENV.nodeEnv);
    await resetDb(knex);
  });

  describe("when body is empty", () => {
    it("refuses to signup with an explicit message", async () => {
      const signUpResponse = await request.post(signUpRoute);
      expect(signUpResponse.status).toBe(400);
      expect(signUpResponse.body).toMatchObject({
        message: "No body was provided",
      });
    });
  });

  describe("when all is good", () => {
    it("calls sign up than login, than getMe", async () => {
      const userUuid: UserUuid = generateUuid();
      const email = "hey@mail.com";
      const password = "CraZy123";
      const signUpParams: SignUpParams = {
        uuid: userUuid,
        email,
        firstName: "John",
        lastName: "Doe",
        password,
      };
      const signUpResponse = await request.post(signUpRoute).send(signUpParams);
      expect(signUpResponse.body).toMatchObject({
        currentUser: { email },
      });

      const loginParams: LoginParams = {
        email,
        password,
      };
      const loginResponse = await request.post(loginRoute).send(loginParams);
      expect(loginResponse.body).toMatchObject({
        currentUser: { email },
      });

      const { token } = loginResponse.body;
      const getMeResponse = await request
        .get(getMeRoute)
        .set("Authorization", `Bearer ${token}`);
      expect(getMeResponse.body).toMatchObject({
        currentUser: { uuid: userUuid, email },
      });
    });
  });
});
