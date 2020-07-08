import { Result, validationError } from "@paralogs/shared/back";
import { Left, Right } from "purify-ts";
import { trim } from "ramda";

const isEmail = (str: string): boolean =>
  !!str.match(
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );

export class Email {
  private constructor(public readonly value: string) {
    this.value = value;
  }

  static create(email: string): Result<Email> {
    const emailToSave = trim(email);

    if (!isEmail(emailToSave)) {
      return Left(validationError("Not a valid Email"));
    }

    return Right(new Email(emailToSave.toLowerCase()));
  }
}
