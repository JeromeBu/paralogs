import { LeftAsync, ResultAsync, RightAsyncVoid } from "@paralogs/shared/back";
import { PilotEntity, PilotRepo } from "@paralogs/logbook/domain";
import { PilotUuid } from "@paralogs/logbook/interfaces";
import Knex from "knex";
import { EitherAsync, Maybe, MaybeAsync } from "purify-ts";

import { knexError } from "../knex/knexErrors";
import { PilotPersisted } from "./PilotPersistence";
import { pilotPersistenceMapper } from "./pilotPersistenceMapper";

export class PgPilotRepo implements PilotRepo {
  constructor(private knex: Knex<any, unknown[]>) {}

  public save(pilotEntity: PilotEntity) {
    return pilotEntity.hasIdentity()
      ? this._update(pilotEntity)
      : this._create(pilotEntity);
  }

  public findByUuid(uuid: PilotUuid) {
    return MaybeAsync(() =>
      this.knex.from<PilotPersisted>("pilots").where({ uuid }).first(),
    )
      .chain((pilotPersistence) =>
        MaybeAsync.liftMaybe(Maybe.fromNullable(pilotPersistence)),
      )
      .map(pilotPersistenceMapper.toEntity);
  }

  private _create(pilotEntity: PilotEntity): ResultAsync<void> {
    const pilotPersistence = pilotPersistenceMapper.toPersistence(pilotEntity);
    return EitherAsync(() => this.knex("pilots").insert(pilotPersistence))
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

  private _update(pilotEntity: PilotEntity): ResultAsync<void> {
    const { firstName, lastName } = pilotEntity.getProps();
    return EitherAsync(() =>
      this.knex
        .from<PilotPersisted>("pilots")
        .where({ uuid: pilotEntity.uuid })
        .update({
          first_name: firstName.value,
          ...(lastName
            ? {
                last_name: lastName?.value,
              }
            : {}),
        }),
    )
      .chain(RightAsyncVoid)
      .chainLeft((error) => {
        // eslint-disable-next-line no-console
        console.error("Fail to update pilot :", error);
        return LeftAsync(knexError("Fail to update pilot"));
      });
  }
}
