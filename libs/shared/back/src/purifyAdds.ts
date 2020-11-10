import {
  Either,
  EitherAsync,
  Just,
  Left,
  Maybe,
  MaybeAsync,
  Right,
} from "purify-ts";

import { AppError } from "./errors";

export type Result<T> = Either<AppError, T>;
export type ResultAsync<T> = EitherAsync<AppError, T>;

export const RightAsync = <T>(t: T) => EitherAsync.liftEither(Right(t));
export const LeftAsync = <T>(t: T) => EitherAsync.liftEither(Left(t));

export const JustAsync = <T>(t: T) => MaybeAsync.liftMaybe(Just(t));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const RightVoid = (param?: any) => Right(undefined);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// export const RightAsyncVoid = (param?: any): ResultAsync<void> =>
//   RightAsync(undefined);

export const RightAsyncVoid = () => EitherAsync.liftEither(Right(undefined));

export const combineEithers = <T extends { [key in string]: Result<unknown> }>(
  resultsObject: T,
): Result<{ [K in keyof T]: T[K] extends Result<infer X> ? X : never }> => {
  // eslint-disable-next-line
  for (const result of Object.values(resultsObject)) {
    if (result.isLeft()) return Left(result.extract());
  }

  return Right(
    Object.keys(resultsObject).reduce(
      (acc, key) => ({
        ...acc,
        [key]: resultsObject[key].extract(),
      }),
      {} as { [K in keyof T]: T[K] extends Result<infer X> ? X : never },
    ),
  );
};

export const checkNotExists = (
  maybeAsyncValue: MaybeAsync<unknown>,
  error: AppError,
): EitherAsync<AppError, unknown> =>
  EitherAsync(async ({ liftEither: lift }) => {
    const maybe = await maybeAsyncValue.run();
    if (maybe.extract()) return lift(Left(error));
    return lift(Right(null));
  });

export const fromNullablePromiseCb = <T>(
  nullablePromiseCb: () => Promise<T | null | undefined>,
): MaybeAsync<T> =>
  MaybeAsync(nullablePromiseCb).chain((value) =>
    MaybeAsync.liftMaybe(Maybe.fromNullable(value)),
  );
