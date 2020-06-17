import { Entity, Result } from "@paralogs/back/shared";
import {
  DateString,
  FlightDTO,
  FlightUuid,
  NumberOfMinutes,
  PilotUuid,
  WingUuid,
} from "@paralogs/shared";
import { Right } from "purify-ts";

interface FlightEntityProps {
  uuid: FlightUuid;
  wingUuid: WingUuid;
  pilotUuid: PilotUuid;
  date: DateString;
  time?: string;
  site: string;
  duration: NumberOfMinutes;
}

export class FlightEntity extends Entity<FlightEntityProps> {
  static create(props: FlightDTO): Result<FlightEntity> {
    return Right(new FlightEntity(props));
  }

  static fromDTO(props: FlightEntityProps) {
    return new FlightEntity(props);
  }

  public get pilotUuid() {
    return this.getProps().pilotUuid;
  }

  public get wingUuid() {
    return this.getProps().wingUuid;
  }

  private constructor(props: FlightEntityProps) {
    super(props);
  }
}
