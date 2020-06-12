import * as faker from "faker";
import merge from "ramda/src/merge";

import { PilotDTO } from "../DTOs";
import { generateUuid } from "../generalTypes/uuid";

export const makePilotDTO = (pilotParams: Partial<PilotDTO> = {}): PilotDTO => {
  const randomUser: PilotDTO = {
    uuid: generateUuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };
  return merge(randomUser, pilotParams);
};
