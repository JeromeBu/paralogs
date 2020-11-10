import {
  AppError,
  LeftAsync,
  ResultAsync,
  RightAsyncVoid,
} from "@paralogs/shared/back";
import { UserUuid } from "@paralogs/auth/interface";
import Knex from "knex";
import { EitherAsync, MaybeAsync, Maybe } from "purify-ts";
import { UserEntity, UserRepo, Email } from "@paralogs/auth/domain";

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
    return MaybeAsync(() =>
      this.knex
        .from<UserPersisted>("users")
        .where({ email: email.value })
        .first(),
    )
      .chain((userPersistence) =>
        MaybeAsync.liftMaybe(Maybe.fromNullable(userPersistence)),
      )
      .map(userPersistenceMapper.toEntity);
  }

  public findByUuid(uuid: UserUuid) {
    return MaybeAsync(() =>
      this.knex.from<UserPersisted>("users").where({ uuid }).first(),
    )
      .chain((userPersistence) =>
        MaybeAsync.liftMaybe(Maybe.fromNullable(userPersistence)),
      )
      .map(userPersistenceMapper.toEntity);
  }

  private _create(userEntity: UserEntity): ResultAsync<void> {
    const userPersistence = userPersistenceMapper.toPersistence(userEntity);
    return EitherAsync<AppError, void>(() => {
      return this.knex("users").insert(userPersistence);
    })
      .ifLeft((error: any) => {
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
    return EitherAsync<Error, void>(() => {
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
