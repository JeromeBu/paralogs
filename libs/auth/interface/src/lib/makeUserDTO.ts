import * as faker from "faker";
import { merge } from "ramda";

import { UserDTO } from "./UserDTOs";
import { generateUuid } from "@paralogs/shared/common";

export const makeUserDTO = (userParams: Partial<UserDTO> = {}): UserDTO => {
  const randomUser: UserDTO = {
    uuid: generateUuid(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
  };
  const user = merge(randomUser, userParams);
  return user;
};
