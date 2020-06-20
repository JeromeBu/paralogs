import {
  combineEithers,
  Entity,
  PersonName,
  ResultAsync,
} from "@paralogs/shared/back";
import {
  SignUpParams,
  UpdateUserDTO,
  UserUuid,
  WithUuid,
} from "@paralogs/auth/interface";
import { liftEither, liftPromise } from "purify-ts/EitherAsync";

import { HashAndTokenManager } from "../gateways/HashAndTokenManager";
import { Email } from "../valueObjects/Email";
import { Password } from "../valueObjects/Password";

interface UserEntityProps {
  uuid: UserUuid;
  email: Email;
  firstName: PersonName;
  lastName?: PersonName;
  // isEmailConfirmed: boolean;
  hashedPassword: string;
  authToken: string;
  password?: never; // this field is forbidden
}

interface UserDependencies {
  hashAndTokenManager: HashAndTokenManager;
}

export class UserEntity extends Entity<UserEntityProps> {
  get email() {
    return this.getProps().email;
  }

  static create(
    params: SignUpParams & WithUuid,
    { hashAndTokenManager }: UserDependencies,
  ): ResultAsync<UserEntity> {
    const eitherValidParams = Email.create(params.email).chain((email) => {
      return Password.create(params.password).chain((password) => {
        return PersonName.create(params.firstName).chain((firstName) => {
          return PersonName.create(params.lastName).map((lastName) => {
            return { email, password, firstName, lastName };
          });
        });
      });
    });

    return liftEither(eitherValidParams).chain(({ password, ...validParams }) =>
      liftPromise(async () => {
        const hashedPassword = await hashAndTokenManager.hash(password);
        return new UserEntity({
          uuid: params.uuid,
          ...validParams,
          // isEmailConfirmed: false,
          authToken: hashAndTokenManager.generateToken({
            userUuid: params.uuid,
          }),
          hashedPassword,
        });
      }),
    );
  }

  static fromDTO(props: UserEntityProps): UserEntity {
    return new UserEntity(props);
  }

  update(params: UpdateUserDTO) {
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
    { hashAndTokenManager }: UserDependencies,
  ): Promise<boolean> {
    return hashAndTokenManager.compareHashes(
      candidatePassword,
      this.props.hashedPassword,
    );
  }

  private constructor(props: UserEntityProps) {
    super(props);
  }
}

export interface WithCurrentUser {
  currentUser: UserEntity;
}
