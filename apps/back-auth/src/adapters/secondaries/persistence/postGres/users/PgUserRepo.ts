import { LeftAsync, ResultAsync, RightAsyncVoid } from "@paralogs/back/shared";
import { UserUuid } from "@paralogs/auth/interface";
import Knex from "knex";
import { Maybe } from "purify-ts";
import { liftPromise as liftPromiseToEitherAsync } from "purify-ts/EitherAsync";
import {
  liftMaybe,
  liftPromise as liftPromiseToMaybeAsync,
} from "purify-ts/MaybeAsync";

import { UserEntity } from "../../../../../domain/writes/entities/UserEntity";
import { UserRepo } from "../../../../../domain/writes/gateways/UserRepo";
import { Email } from "../../../../../domain/writes/valueObjects/user/Email";
import { knexError } from "../knex/knexErrors";
import { UserPersisted } from "./UserPersistence";
import { userPersistenceMapper } from "./userPersistenceMapper";

export class PgUserRepo implements UserRepo {
  constructor(private knex: Knex<any, unknown[]>) {}

  public save(userEntity: UserEntity) {
    return userEntity.hasIdentity()
      ? this._update(userEntity)
      : this._create(userEntity);
  }

  public findByEmail(email: Email) {
    return liftPromiseToMaybeAsync(() =>
      this.knex
        .from<UserPersisted>("users")
        .where({ email: email.value })
        .first(),
    )
      .chain((userPersistence) =>
        liftMaybe(Maybe.fromNullable(userPersistence)),
      )
      .map(userPersistenceMapper.toEntity);
  }

  public findByUuid(uuid: UserUuid) {
    return liftPromiseToMaybeAsync(() =>
      this.knex.from<UserPersisted>("users").where({ uuid }).first(),
    )
      .chain((userPersistence) =>
        liftMaybe(Maybe.fromNullable(userPersistence)),
      )
      .map(userPersistenceMapper.toEntity);
  }

  private _create(userEntity: UserEntity): ResultAsync<void> {
    const userPersistence = userPersistenceMapper.toPersistence(userEntity);
    return liftPromiseToEitherAsync(() =>
      this.knex("users").insert(userPersistence),
    )
      .chainLeft((error: any) => {
        const isEmailTaken: boolean =
          error.detail?.includes("already exists") &&
          error.detail?.includes("email");
        return LeftAsync(
          knexError(
            isEmailTaken
              ? "Email is already taken. Consider logging in."
              : error.message,
          ),
        );
      })
      .chain(RightAsyncVoid);
  }

  private _update(userEntity: UserEntity) {
    const { firstName, lastName } = userEntity.getProps();
    return liftPromiseToEitherAsync(() => {
      return this.knex
        .from<UserPersisted>("users")
        .where({ uuid: userEntity.uuid })
        .update({
          first_name: firstName.value,
          ...(lastName ? { last_name: lastName?.value } : {}),
        });
    })
      .chain(RightAsyncVoid)
      .mapLeft((error) => knexError(error.message));
  }
}
