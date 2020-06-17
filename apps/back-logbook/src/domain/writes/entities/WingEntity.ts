import { Entity, Result } from "@paralogs/back/shared";
import {
  DateString,
  NumberOfMinutes,
  PilotUuid,
  UpdateWingDTO,
  WingDTO,
  WingUuid,
} from "@paralogs/shared";
import { Right } from "purify-ts";

interface WingEntityProps {
  uuid: WingUuid;
  pilotUuid: PilotUuid;
  brand: string;
  model: string;
  ownerFrom: DateString;
  ownerUntil?: DateString;
  flightTimePriorToOwn: NumberOfMinutes;
}

export class WingEntity extends Entity<WingEntityProps> {
  static create(props: WingDTO): Result<WingEntity> {
    return Right(new WingEntity(props));
  }

  public update(updateParams: UpdateWingDTO) {
    const wingEntity = new WingEntity({ ...this.getProps(), ...updateParams });
    wingEntity.setIdentity(this.getIdentity());
    return wingEntity;
  }

  get pilotUuid() {
    return this.props.pilotUuid;
  }

  static fromDTO(props: WingEntityProps): WingEntity {
    return new WingEntity(props);
  }

  private constructor(props: WingEntityProps) {
    super(props);
  }
}
