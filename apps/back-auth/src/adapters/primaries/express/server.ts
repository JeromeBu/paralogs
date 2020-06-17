import { createAuthenticateMiddleware } from "@paralogs/back/shared";
import { ENV } from "@paralogs/shared";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import { authController } from "../controllers/auth.controller";

console.log("ENV : ", ENV);

export const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));

app.use(createAuthenticateMiddleware(ENV.jwtSecret));

app.use(authController());
