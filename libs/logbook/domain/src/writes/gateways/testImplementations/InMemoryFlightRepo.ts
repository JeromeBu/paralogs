import {
  LeftAsync,
  ResultAsync,
  RightAsyncVoid,
  validationError,
} from "@paralogs/shared/back";
import { FlightUuid, PilotUuid } from "@paralogs/logbook/interfaces";
import { FlightEntity } from "@paralogs/logbook/domain";
import { List } from "purify-ts";
import { liftMaybe } from "purify-ts/MaybeAsync";

import { FlightRepo } from "../FlightRepo";

export class InMemoryFlightRepo implements FlightRepo {
  private _flights: FlightEntity[] = [];

  public findByUuid(flightUuid: FlightUuid) {
    return liftMaybe(
      List.find((flight) => flight.uuid === flightUuid, this._flights),
    );
  }

  public async findByPilotUuid(pilotUuid: PilotUuid) {
    return this._flights.filter(
      (flight) => flight.getProps().pilotUuid === pilotUuid,
    );
  }

  public save(flightEntity: FlightEntity): ResultAsync<void> {
    if (flightEntity.hasIdentity())
      return LeftAsync(validationError("TODO handle update"));
    this._flights.push(flightEntity);
    return RightAsyncVoid();
  }

  get flights() {
    return this._flights;
  }
}
