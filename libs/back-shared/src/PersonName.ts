import { Right } from "purify-ts";
import trim from "ramda/src/trim";

import { Result } from "./purifyAdds";

const firstLetterUpperCase = (str: string) => {
  const [firstLetter, ...rest] = str.split("");
  return [firstLetter.toUpperCase(), ...rest].join("");
};

export class PersonName {
  private constructor(public readonly value: string) {}

  static create(name?: string): Result<PersonName> {
    if (!name) return Right(new PersonName(""));
    return Right(new PersonName(firstLetterUpperCase(trim(name))));
  }
}
