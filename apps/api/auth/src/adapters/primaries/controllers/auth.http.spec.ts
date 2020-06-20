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
} from "@paralogs/auth/interface";
import supertest from "supertest";
import { getKnex, resetDb } from "@paralogs/auth/secondary-adapters";
import { ENV } from "@paralogs/shared/back";

import { app } from "../express/server";

const request = supertest(app);

describe("Authentication routes", () => {
  beforeAll(async () => {
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
      const email = "hey@mail.com";
      const password = "CraZy123";
      const signUpParams: SignUpParams = {
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
        currentUser: { email },
      });
    });
  });
});
