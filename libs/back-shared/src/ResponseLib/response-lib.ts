import type { Response } from "express";
import { EitherAsync } from "purify-ts";
import { liftPromise } from "purify-ts/EitherAsync";
import * as R from "ramda";
import { ObjectSchema, Shape } from "yup";

import { AppError, validationError } from "../errors";
import { LeftAsync, ResultAsync } from "../purifyAdds";

const buildResponse = (statusCode: number, body: unknown): HttpResponse => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
  body,
});

export const success = (body: unknown, statusCode = 200) =>
  buildResponse(statusCode, body);

export const failure = (errorMessage: string, statusCode?: number) =>
  buildResponse(statusCode ?? 500, { message: errorMessage });

export interface HttpResponse {
  statusCode: number;
  headers: Record<string, unknown>;
  body: unknown;
}


export const validateSchema = <T extends object>(
  validationSchema: ObjectSchema<Shape<object, T>>,
  body: any,
): ResultAsync<Shape<object, T>> => {
  if (R.isEmpty(body))
    return LeftAsync(validationError("No body was provided"));
  return liftPromise(() =>
    validationSchema.validate(body, { abortEarly: false }),
  );
};

type CallUseCaseParams<P> = {
  useCase: (params: P) => EitherAsync<AppError, unknown>;
  eitherAsyncParams: EitherAsync<AppError, P>;
};

export const callUseCase = <P>({
  useCase,
  eitherAsyncParams,
}: CallUseCaseParams<P>): Promise<HttpResponse> => {
  return eitherAsyncParams
    .chain(useCase)
    .run()
    .then((eitherReturned) =>
      eitherReturned
        .map(success)
        .mapLeft((error) => failure(error.message, error.code))
        .extract(),
    );
};

export const sendHttpResponse = (res: Response, httpResponse: HttpResponse) => {
  res.status(httpResponse.statusCode);
  return res.json(httpResponse.body);
};
