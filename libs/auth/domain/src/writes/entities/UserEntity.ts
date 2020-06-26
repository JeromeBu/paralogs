import { combineEithers, Entity, PersonName } from "@paralogs/shared/back";
import { UpdateUserDTO, UserUuid } from "@paralogs/auth/interface";
import { Hasher, TokenManager } from "../..";

import { Email } from "../valueObjects/Email";
import { Password } from "../valueObjects/Password";

interface UserEntityParams {
  uuid: UserUuid;
  firstName: PersonName;
  lastName?: PersonName;
  email: Email;
  password: Password;
}

interface UserEntityProps extends UserEntityParams {
  authToken: string;
}

interface UserDependencies {
  tokenManager: TokenManager;
}

export class UserEntity extends Entity<UserEntityProps> {
  get email() {
    return this.getProps().email;
  }

  static create(
    params: UserEntityParams,
    { tokenManager }: UserDependencies,
  ): UserEntity {
    return new UserEntity({
      uuid: params.uuid,
      ...params,
      // isEmailConfirmed: false,
      authToken: tokenManager.generateToken({
        userUuid: params.uuid,
      }),
    });
  }

  static fromDTO(props: UserEntityProps): UserEntity {
    return new UserEntity(props);
  }

  public update(params: UpdateUserDTO) {
    return combineEithers({
      ...(params.firstName
        ? { firstName: PersonName.create(params.firstName) }
        : {}),
      ...(params.lastName
        ? { lastName: PersonName.create(params.lastName) }
        : {}),
    }).map((validParams) => {
      const userEntity = new UserEntity({ ...this.props, ...validParams });
      userEntity.setIdentity(this.getIdentity());
      return userEntity;
    });
  }

  public checkPassword(
    candidatePassword: string,
    hasher: Hasher,
  ): Promise<boolean> {
    return this.props.password.isEqual(candidatePassword, hasher);
  }

  private constructor(props: UserEntityProps) {
    super(props);
  }
}

export interface WithCurrentUser {
  currentUser: UserEntity;
}
