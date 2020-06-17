import {
  combineEithers,
  Entity,
  PersonName,
  Result,
} from "@paralogs/back/shared";
import {
  PilotDTO,
  PilotUuid,
  UpdatePilotDTO,
} from "@paralogs/logbook/interfaces";

interface PilotEntityProps {
  uuid: PilotUuid;
  firstName: PersonName;
  lastName?: PersonName;
}

export class PilotEntity extends Entity<PilotEntityProps> {
  static create(params: PilotDTO): Result<PilotEntity> {
    return PersonName.create(params.firstName).chain((firstName) => {
      return PersonName.create(params.lastName).map((lastName) => {
        return new PilotEntity({
          uuid: params.uuid,
          firstName,
          lastName,
        });
      });
    });
  }

  update(params: UpdatePilotDTO) {
    return combineEithers({
      ...(params.firstName
        ? { firstName: PersonName.create(params.firstName) }
        : {}),
      ...(params.lastName
        ? { lastName: PersonName.create(params.lastName) }
        : {}),
    }).map((validParams) => {
      const userEntity = new PilotEntity({ ...this.props, ...validParams });
      userEntity.setIdentity(this.getIdentity());
      return userEntity;
    });
  }

  static fromDTO(props: PilotEntityProps): PilotEntity {
    return new PilotEntity(props);
  }

  private constructor(props: PilotEntityProps) {
    super(props);
  }
}

export interface WithCurrentUser {
  currentUser: PilotEntity;
}
