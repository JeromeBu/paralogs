import * as faker from "faker";
import merge from "ramda/src/merge";
import { generateUuid } from "@paralogs/shared/common";

import { PilotDTO } from "./PilotDTOs";

export const makePilotDTO = (pilotParams: Partial<PilotDTO> = {}): PilotDTO => {
  const randomUser: PilotDTO = {
    uuid: generateUuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };
  return merge(randomUser, pilotParams);
};
