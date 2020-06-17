import { Result } from "@paralogs/back-shared";

export const expectRight = (result: Result<unknown>) => {
  result.ifLeft((error) => {
    expect(error.message).toBeUndefined();
  });
  expect(result.isRight()).toBe(true);
};

export const expectEitherToMatchError = (
  either: Result<any>,
  expectedErrorMessage: string,
) => {
  expect((either.extract() as any).message).toMatch(expectedErrorMessage);
};
