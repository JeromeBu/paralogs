import { UserDTO } from "@paralogs/shared";

import { UserEntity } from "../entities/UserEntity";

export const userMapper = {
  entityToDTO: (userEntity: UserEntity): UserDTO => {
    const { email, firstName, lastName } = userEntity.getProps();
    return {
      uuid: userEntity.uuid,
      email: email.value,
      firstName: firstName.value,
      lastName: lastName?.value,
    };
  },
};
