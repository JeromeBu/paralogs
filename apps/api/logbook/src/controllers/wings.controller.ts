import {
  callUseCase,
  RightAsync,
  sendHttpResponse,
  validateSchema,
} from "@paralogs/shared/back";
import {
  addWingSchema,
  updateWingSchema,
  wingsRoute,
} from "@paralogs/logbook/interfaces";
import { Router } from "express";

import { wingsUseCases } from "../config/useCasesChoice";

const wingsRouter = Router();

export const wingsController = () => {
  wingsRouter
    .route(wingsRoute)
    .get(async (req, res) =>
      sendHttpResponse(
        res,
        await callUseCase({
          useCase: wingsUseCases.retrieveWings,
          eitherAsyncParams: RightAsync(req.currentUserUuid),
        }),
      ),
    )
    .post(async (req, res) => {
      const eitherAsyncParams = validateSchema(addWingSchema, req.body);
      return sendHttpResponse(
        res,
        await callUseCase({
          useCase: wingsUseCases.addWing,
          eitherAsyncParams: eitherAsyncParams.map((addWingBody) => ({
            ...addWingBody,
            pilotUuid: req.currentUserUuid,
          })),
        }),
      );
    })
    .put(async (req, res) => {
      const resultUpdateWingBody = await validateSchema(
        updateWingSchema,
        req.body,
      );
      return sendHttpResponse(
        res,
        await callUseCase({
          useCase: wingsUseCases.updateWing,
          eitherAsyncParams: resultUpdateWingBody.map((updateWingBody) => ({
            ...updateWingBody,
            pilotUuid: req.currentUserUuid,
          })),
        }),
      );
    });

  return wingsRouter;
};
