import {
  notFoundError,
  ResultAsync,
  RightAsyncVoid,
} from "@paralogs/back/shared";
import { WingEntity, WingRepo } from "@paralogs/logbook/domain";
import { PilotUuid, WingUuid } from "@paralogs/logbook/interfaces";
import Knex from "knex";
import { liftPromise as liftPromiseToEitherAsync } from "purify-ts/EitherAsync";
import { Maybe } from "purify-ts/Maybe";
import {
  liftMaybe,
  liftPromise as liftPromiseToMaybeAsync,
} from "purify-ts/MaybeAsync";

import { knexError } from "../knex/knexErrors";
import { PilotPersisted } from "../pilots/PilotPersistence";
import { WingPersisted } from "./WingPersistence";
import { wingPersistenceMapper } from "./wingPersistenceMapper";

export class PgWingRepo implements WingRepo {
  constructor(private knex: Knex<any, unknown[]>) {}

  public async findByPilotUuid(pilot_uuid: PilotUuid) {
    return (
      await this.knex.from<WingPersisted>("wings").where({ pilot_uuid })
    ).map(wingPersistenceMapper.toEntity);
  }

  public findByUuid(uuid: WingUuid) {
    return liftPromiseToMaybeAsync(() =>
      this.knex.from<WingPersisted>("wings").where({ uuid }).first(),
    )
      .chain((w) => liftMaybe(Maybe.fromNullable(w)))
      .map(wingPersistenceMapper.toEntity);
  }

  public save(wingEntity: WingEntity) {
    return this._getPilotId(wingEntity.pilotUuid).chain((pilotId) =>
      wingEntity.hasIdentity()
        ? this._update(wingEntity, pilotId)
        : this._create(wingEntity, pilotId),
    );
  }

  private _create(wingEntity: WingEntity, pilot_id: number) {
    const wingPersistence = wingPersistenceMapper.toPersistence(wingEntity);
    return liftPromiseToEitherAsync(() =>
      this.knex<WingPersisted>("wings").insert({
        ...wingPersistence,
        pilot_id,
        id: undefined,
      }),
    )
      .chain(RightAsyncVoid)
      .mapLeft((error) => knexError(error.message));
  }

  private _update(wingEntity: WingEntity, pilot_id: number) {
    const {
      brand,
      model,
      pilotUuid,
      flightTimePriorToOwn,
      ownerFrom,
      ownerUntil,
    } = wingEntity.getProps();

    return liftPromiseToEitherAsync(() =>
      this.knex
        .from<WingPersisted>("wings")
        .where({ uuid: wingEntity.uuid })
        .update({
          brand,
          model,
          pilot_uuid: pilotUuid,
          pilot_id,
          flight_time_prior_to_own: flightTimePriorToOwn,
          owner_from: ownerFrom,
          owner_until: ownerUntil,
        }),
    )
      .chain(RightAsyncVoid)
      .mapLeft((error) => knexError(error.message));
  }

  private _getPilotId(uuid: PilotUuid): ResultAsync<number> {
    return liftPromiseToMaybeAsync(() =>
      this.knex
        .from<PilotPersisted>("pilots")
        .select("id")
        .where({ uuid })
        .first(),
    )
      .chain((p) => liftMaybe(Maybe.fromNullable(p)))
      .map(({ id }) => id)
      .toEitherAsync(notFoundError(`No pilot matched this pilotUuid: ${uuid}`));
  }
}
