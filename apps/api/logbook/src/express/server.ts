import { createAuthenticateMiddleware } from "@paralogs/shared/back";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import { ENV } from "@paralogs/shared/back";
import { getEventBus } from "../config/secondaryAdaptersChoice";
import { flightsController } from "../controllers/flights.controller";
import { subscribeToEvents } from "../controllers/pilots.subscribers";
import { wingsController } from "../controllers/wings.controller";

console.log("--- Logbook --- ENV : ", ENV);

export const configureServer = async () => {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());
  app.use(morgan("dev"));

  app.use(createAuthenticateMiddleware(ENV.jwtSecret));

  app.use(wingsController());
  app.use(flightsController());

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  subscribeToEvents(await getEventBus());

  return app;
};
