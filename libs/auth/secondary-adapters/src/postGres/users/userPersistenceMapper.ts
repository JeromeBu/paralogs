import { combineEithers, PersonName } from "@paralogs/shared/back";
import { UserDTO } from "@paralogs/auth/interface";

import { Email, Password, UserEntity } from "@paralogs/auth/domain";
import { UserPersistence } from "./UserPersistence";

export const userPersistenceMapper = {
  toPersistence: (userEntity: UserEntity): UserPersistence => {
    const identity = userEntity.getIdentity();
    const {
      email,
      authToken,
      password,
      uuid,
      firstName,
      lastName,
    } = userEntity.getProps();
    return {
      id: identity,
      uuid,
      email: email.value,
      first_name: firstName.value,
      last_name: lastName?.value,
      auth_token: authToken,
      password: password.value,
    };
  },
  toEntity: (params: UserPersistence): UserEntity => {
    return combineEithers({
      email: Email.create(params.email),
      firstName: PersonName.create(params.first_name),
      lastName: PersonName.create(params.last_name),
    })
      .map((validResults) => {
        const userEntity = UserEntity.fromDTO({
          ...validResults,
          uuid: params.uuid,
          authToken: params.auth_token,
          password: Password.fromHash(params.password),
        });
        userEntity.setIdentity(params.id);
        return userEntity;
      })
      .ifLeft((error) => {
        throw error;
      })
      .extract() as UserEntity;
  },
  toDTO: (userPersisted: UserPersistence): UserDTO => ({
    uuid: userPersisted.uuid,
    email: userPersisted.email,
    firstName: userPersisted.first_name,
    lastName: userPersisted.last_name,
  }),
};
