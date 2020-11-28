import {
  Either,
  EitherAsync,
  Just,
  Left,
  Maybe,
  MaybeAsync,
  Nothing,
  Right,
} from "purify-ts";

import { AppError } from "./errors";

export type Result<T> = Either<AppError, T>;
export type ResultAsync<T> = EitherAsync<AppError, T>;

export const RightAsync = <T>(t: T) => EitherAsync.liftEither(Right(t));
export const LeftAsync = <T>(t: T) => EitherAsync.liftEither(Left(t));

export const JustAsync = <T>(t: T) => MaybeAsync.liftMaybe(Just(t));
export const NothingAsync = <T = unknown>() => MaybeAsync.liftMaybe<T>(Nothing);

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

const chainMaybe = function* <A>(maybe: Maybe<A>) {
  return (yield maybe) as A;
};

export const forMaybe = <V, R extends NonNullable<unknown>, T>(
  generatorFactory: (
    chain: typeof chainMaybe,
  ) => Generator<Maybe<unknown>, R, V>,
): Maybe<R> => {
  const generator = generatorFactory(chainMaybe) as Generator<Maybe<V>, R, V>;

  const resolve = (result: IteratorResult<Maybe<V>, R>): Maybe<R> => {
    if (result.done) return Just(result.value);
    return result.value.chain((v) => resolve(generator.next(v)));
  };

  return resolve(generator.next());
};

const chainMaybeAsync = function* <A>(maybeAsync: MaybeAsync<A>) {
  return (yield maybeAsync) as A;
};

export const forMaybeAsync = <V, R extends NonNullable<unknown>, T>(
  generatorFactory: (
    chain: typeof chainMaybeAsync,
  ) => Generator<MaybeAsync<unknown>, R, V>,
): MaybeAsync<R> => {
  const generator = generatorFactory(chainMaybeAsync) as Generator<
    MaybeAsync<V>,
    R,
    V
  >;

  const resolve = (result: IteratorResult<MaybeAsync<V>, R>): MaybeAsync<R> => {
    if (result.done) return JustAsync(result.value);
    return result.value.chain((v) => resolve(generator.next(v)));
  };

  return resolve(generator.next());
};

const chainEither = function* <E, V>(either: Either<E, V>) {
  return (yield either) as V;
};

export const forEither = <E, V, R>(
  generatorFactory: (
    chain: typeof chainEither,
  ) => Generator<Either<E, unknown>, R, V>,
): Either<E, R> => {
  const generator = generatorFactory(chainEither) as Generator<
    Either<E, V>,
    R,
    V
  >;

  const resolve = (result: IteratorResult<Either<E, V>, R>): Either<E, R> => {
    if (result.done) return Right(result.value);
    return result.value.chain((v) => resolve(generator.next(v)));
  };

  return resolve(generator.next());
};

const chainEitherAsync = function* <E, V>(either: EitherAsync<E, V>) {
  return (yield either) as V;
};

export const forEitherAsync = <E, V, R>(
  generatorFactory: (
    chain: typeof chainEitherAsync,
  ) => Generator<EitherAsync<E, unknown>, R, V>,
): EitherAsync<E, R> => {
  const generator = generatorFactory(chainEitherAsync) as Generator<
    EitherAsync<E, V>,
    R,
    V
  >;

  const resolve = (
    result: IteratorResult<EitherAsync<E, V>, R>,
  ): EitherAsync<E, R> => {
    if (result.done) return RightAsync(result.value);
    return result.value.chain((v) => resolve(generator.next(v)));
  };

  return resolve(generator.next());
};
