import {
  callUseCase,
  RightAsync,
  sendHttpResponse,
  validateSchema,
} from "@paralogs/shared/back";
import { addFlightSchema, flightsRoute } from "@paralogs/logbook/interfaces";
import { Router } from "express";

import { flightsUseCases } from "../config/useCasesChoice";

export const flightsRouter = Router();

export const flightsController = () => {
  flightsRouter
    .route(flightsRoute)
    .post(async (req, res) => {
      const resultAddFlightBody = await validateSchema(
        addFlightSchema,
        req.body,
      );
      return sendHttpResponse(
        res,
        await callUseCase({
          useCase: flightsUseCases.addFlight,
          eitherAsyncParams: resultAddFlightBody.map((addFlightBody) => ({
            ...addFlightBody,
            pilotUuid: req.currentUserUuid,
          })),
        }),
      );
    })
    .get(async (req, res) => {
      return sendHttpResponse(
        res,
        await callUseCase({
          useCase: flightsUseCases.retrieveFlights,
          eitherAsyncParams: RightAsync(req.currentUserUuid),
        }),
      );
    });

  return flightsRouter;
};
