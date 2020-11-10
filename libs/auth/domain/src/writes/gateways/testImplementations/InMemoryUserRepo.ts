import { UserUuid } from "@paralogs/auth/interface";
import {
  getNextId,
  LeftAsync,
  notFoundError,
  ResultAsync,
  RightAsyncVoid,
  validationError,
} from "@paralogs/shared/back";
import { findByUuidAndReplace } from "@paralogs/shared/common";
import { EitherAsync, Left, List, MaybeAsync } from "purify-ts";

import { UserEntity } from "../../entities/UserEntity";
import { UserRepo } from "../UserRepo";
import { Email } from "../../valueObjects/Email";

export class InMemoryUserRepo implements UserRepo {
  private _users: UserEntity[] = [];

  public save(userEntity: UserEntity): ResultAsync<void> {
    if (userEntity.hasIdentity()) return this._update(userEntity);
    return this._create(userEntity);
  }

  public findByEmail(email: Email) {
    return MaybeAsync.liftMaybe(
      List.find(
        (userEntity) => userEntity.getProps().email.value === email.value,
        this._users,
      ),
    );
  }

  public findByUuid(userUuid: UserUuid) {
    return MaybeAsync.liftMaybe(
      List.find((userEntity) => userEntity.uuid === userUuid, this._users),
    );
  }

  get users() {
    return this._users;
  }

  public setUsers(users: UserEntity[]) {
    this._users.splice(0, users.length, ...users);
  }

  private _create(userEntity: UserEntity): ResultAsync<void> {
    const isEmailTaken = !!this._users.find(
      (user) =>
        user.getProps().email.value === userEntity.getProps().email.value,
    );
    if (isEmailTaken)
      return EitherAsync.liftEither(
        Left(validationError("Email is already taken. Consider logging in.")),
      );
    userEntity.setIdentity(getNextId(this._users));
    this._users.push(userEntity);
    return RightAsyncVoid();
  }

  private _update(userEntity: UserEntity): ResultAsync<void> {
    const newUsers = findByUuidAndReplace(this._users, userEntity);
    if (this._users === newUsers)
      return LeftAsync(notFoundError("No user found with this id"));
    this._users = newUsers;
    return RightAsyncVoid();
  }
}
