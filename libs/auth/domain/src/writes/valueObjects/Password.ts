import {
  AppError,
  LeftAsync,
  ResultAsync,
  validationError,
} from "@paralogs/shared/back";
import { liftPromise } from "purify-ts/EitherAsync";
import { Hasher } from "../gateways/Hasher";

export class Password {
  private constructor(public readonly value: string) {}

  static create(password: string, hasher: Hasher): ResultAsync<Password> {
    if (password.length < 8)
      return failWithMessage("Password must be at least 8 characters long");
    if (password.toLowerCase() === password)
      return failWithMessage("Password must have upper case characters");
    if (password.toUpperCase() === password)
      return failWithMessage("Password must have lower case characters");

    return liftPromise<string, AppError>(() => hasher.hash(password)).map(
      (hashedPwd) => new Password(hashedPwd),
    );
  }

  static fromHash(hash: string) {
    return new Password(hash);
  }

  public isEqual(candidate: string, hasher: Hasher): Promise<boolean> {
    return hasher.compare(candidate, this.value);
  }
}

const failWithMessage = (message: string) =>
  LeftAsync(validationError(message));
