import { Entity } from "./Entity";
import { Result } from "./purifyAdds";

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

export const getNextId = <T extends Entity<any>>(entities: T[]) =>
  1 + Math.max(0, ...entities.map((wing) => wing.getIdentity() || 0));
