import { createAuthenticateMiddleware } from "@paralogs/shared/back";
import { ENV } from "@paralogs/shared/back";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import { authController } from "../controllers/auth.controller";

console.log("--- Auth --- ENV : ", ENV);

export const configureServer = async () => {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());
  app.use(morgan("dev"));

  app.use(createAuthenticateMiddleware(ENV.jwtSecret));

  app.use(await authController());
  return app;
};
