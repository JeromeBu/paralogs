import {
  LeftAsync,
  notFoundError,
  ResultAsync,
  RightAsyncVoid,
  validationError,
} from "@paralogs/back-shared";
import { FlightUuid, PilotUuid, WingUuid } from "@paralogs/shared";
import Knex from "knex";
import { Maybe } from "purify-ts";
import { liftPromise as liftPromiseToEitherAsync } from "purify-ts/EitherAsync";
import {
  liftMaybe,
  liftPromise as liftPromiseToMaybeAsync,
} from "purify-ts/MaybeAsync";

import { FlightEntity } from "../../../../../domain/writes/entities/FlightEntity";
import { FlightRepo } from "../../../../../domain/writes/gateways/FlightRepo";
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
        liftPromiseToEitherAsync(() =>
          this.knex<FlightPersistence>("flights").insert({
            ...flightPersistenceMapper.toPersistence(flightEntity),
            pilot_id,
            wing_id,
            id: undefined,
          }),
        ),
      )
      .chain(RightAsyncVoid);
  }

  public async findByPilotUuid(pilot_uuid: PilotUuid) {
    return (
      await this.knex.from<FlightPersisted>("flights").where({ pilot_uuid })
    ).map(flightPersistenceMapper.toEntity);
  }

  public findByUuid(uuid: FlightUuid) {
    return liftPromiseToMaybeAsync(() =>
      this.knex.from<FlightPersisted>("flights").where({ uuid }).first(),
    )
      .chain((flightPersistence) =>
        liftMaybe(Maybe.fromNullable(flightPersistence)),
      )
      .map(flightPersistenceMapper.toEntity);
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
      .toEitherAsync(notFoundError("No pilot matched this pilotUuid"));
  }

  private _getWingId(uuid: WingUuid): ResultAsync<number> {
    return liftPromiseToMaybeAsync(() =>
      this.knex
        .from<WingPersisted>("wings")
        .select("id")
        .where({ uuid })
        .first(),
    )
      .chain((wingPersisted) => liftMaybe(Maybe.fromNullable(wingPersisted)))
      .map(({ id }) => id)
      .toEitherAsync(notFoundError("No wing matched this wingUuid"));
  }
}
