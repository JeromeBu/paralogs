import * as faker from "faker";
import { merge } from "ramda";

import { UserDTO } from "../DTOs";
import { generateUuid } from "../generalTypes/uuid";

export const makeUserDTO = (userParams: Partial<UserDTO> = {}): UserDTO => {
  const randomUser: UserDTO = {
    uuid: generateUuid(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
  };
  const user = merge(randomUser, userParams);
  return user;
};
