import Knex from "knex";
import { EitherAsync, Maybe, MaybeAsync } from "purify-ts";

import {
  LeftAsync,
  notFoundError,
  ResultAsync,
  RightAsyncVoid,
  validationError,
} from "@paralogs/shared/back";
import { FlightUuid, PilotUuid, WingUuid } from "@paralogs/logbook/interfaces";
import { FlightEntity, FlightRepo } from "@paralogs/logbook/domain";
import { error } from "util";
import { knexError } from "../knex/knexErrors";

import { PilotPersisted } from "../pilots/PilotPersistence";
import { WingPersisted } from "../wings/WingPersistence";
import { FlightPersisted, FlightPersistence } from "./FlightPersistence";
import { flightPersistenceMapper } from "./flightPersistenceMapper";

export class PgFlightRepo implements FlightRepo {
  constructor(private knex: Knex<any, unknown[]>) {}

  public save(flightEntity: FlightEntity): ResultAsync<void> {
    if (flightEntity.hasIdentity())
      return LeftAsync(validationError("TODO handle update"));

    this._getPilotId(flightEntity.pilotUuid);

    const eitherParams = this._getPilotId(flightEntity.pilotUuid).chain(
      (pilot_id) =>
        this._getWingId(flightEntity.wingUuid).map((wing_id) => ({
          wing_id,
          pilot_id,
        })),
    );

    return eitherParams
      .chain(({ pilot_id, wing_id }) =>
        EitherAsync<Error, unknown>(() =>
          this.knex<FlightPersistence>("flights").insert({
            ...flightPersistenceMapper.toPersistence(flightEntity),
            pilot_id,
            wing_id,
            id: undefined,
          }),
        ),
      )
      .chain(RightAsyncVoid)
      .mapLeft((error) => knexError(error.message));
  }

  public async findByPilotUuid(pilot_uuid: PilotUuid) {
    return (
      await this.knex.from<FlightPersisted>("flights").where({ pilot_uuid })
    ).map(flightPersistenceMapper.toEntity);
  }

  public findByUuid(uuid: FlightUuid) {
    return MaybeAsync(() =>
      this.knex.from<FlightPersisted>("flights").where({ uuid }).first(),
    )
      .chain((flightPersistence) =>
        MaybeAsync.liftMaybe(Maybe.fromNullable(flightPersistence)),
      )
      .map(flightPersistenceMapper.toEntity);
  }

  private _getPilotId(uuid: PilotUuid): ResultAsync<number> {
    return MaybeAsync(() =>
      this.knex
        .from<PilotPersisted>("pilots")
        .select("id")
        .where({ uuid })
        .first(),
    )
      .chain((p) => MaybeAsync.liftMaybe(Maybe.fromNullable(p)))
      .map(({ id }) => id)
      .toEitherAsync(notFoundError("No pilot matched this pilotUuid"));
  }

  private _getWingId(uuid: WingUuid): ResultAsync<number> {
    return MaybeAsync(() =>
      this.knex
        .from<WingPersisted>("wings")
        .select("id")
        .where({ uuid })
        .first(),
    )
      .chain((wingPersisted) =>
        MaybeAsync.liftMaybe(Maybe.fromNullable(wingPersisted)),
      )
      .map(({ id }) => id)
      .toEitherAsync(notFoundError("No wing matched this wingUuid"));
  }
}
