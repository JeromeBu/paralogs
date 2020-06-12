import { createAuthenticateMiddleware } from "@paralogs/back-shared";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import { ENV } from "../../../config/env";
import { authController } from "../controllers/auth.controller";

export const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));

app.use(createAuthenticateMiddleware(ENV.jwtSecret));

app.use(authController());
