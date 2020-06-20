import { Result, validationError } from "@paralogs/shared/back";
import { Left, Right } from "purify-ts";

export class Password {
  private constructor(public readonly value: string) {
    this.value = value;
  }

  static create(password: string): Result<Password> {
    if (password.length < 8)
      return Left(
        validationError("Password must be at least 8 characters long"),
      );
    if (password.toLowerCase() === password)
      return Left(validationError("Password must have upper case characters"));
    if (password.toUpperCase() === password)
      return Left(validationError("Password must have lower case characters"));

    return Right(new Password(password));
  }
}
