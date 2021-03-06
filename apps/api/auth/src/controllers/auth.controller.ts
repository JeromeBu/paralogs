import {
  callUseCase,
  RightAsync,
  sendHttpResponse,
  validateSchema,
} from "@paralogs/shared/back";
import {
  getMeRoute,
  loginRoute,
  loginSchema,
  signUpRoute,
  signUpSchema,
  updateUserSchema,
} from "@paralogs/auth/interface";
import { pilotsRoute } from "@paralogs/auth/interface";
import { Router } from "express";

import { getAuthUseCases } from "../config/useCasesChoice";

const authRouter = Router();

export const authController = async (): Promise<Router> => {
  const authUseCases = await getAuthUseCases();
  authRouter.post(loginRoute, async (req, res) => {
    const eitherAsyncParams = await validateSchema(loginSchema, req.body);
    const httpResponse = await callUseCase({
      eitherAsyncParams,
      useCase: authUseCases.login,
    });
    return sendHttpResponse(res, httpResponse);
  });

  authRouter.post(signUpRoute, async (req, res) => {
    const eitherAsyncParams = await validateSchema(signUpSchema, req.body);
    const httpResponse = await callUseCase({
      eitherAsyncParams,
      useCase: authUseCases.signUp,
    });
    return sendHttpResponse(res, httpResponse);
  });

  authRouter.get(getMeRoute, async (req, res) => {
    const { currentUserUuid } = req;

    const httpResponse = await callUseCase({
      eitherAsyncParams: RightAsync({ userUuid: currentUserUuid }),
      useCase: authUseCases.getMe,
    });
    return sendHttpResponse(res, httpResponse);
  });

  authRouter.put(pilotsRoute, async (req, res) => {
    const resultBody = await validateSchema(updateUserSchema, req.body);

    const httpResponse = await callUseCase({
      useCase: authUseCases.updateUser,
      eitherAsyncParams: resultBody.map((body) => ({
        ...body,
        uuid: req.currentUserUuid,
      })),
    });
    return sendHttpResponse(res, httpResponse);
  });

  return authRouter;
};
