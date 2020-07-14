import { Express } from "express";
import supertest from "supertest";

export const getSupertestRequest = async (
  configureServer: () => Promise<Express>,
) => {
  const app = await configureServer();
  return supertest(app);
};

export type SupertestRequest = supertest.SuperTest<supertest.Test>;
