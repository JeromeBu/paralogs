import { WingDTO } from "@paralogs/logbook/interfaces";

import { WingEntity } from "../../../../../domain/writes/entities/WingEntity";
import { WingPersistence } from "./WingPersistence";

export const wingPersistenceMapper = {
  toPersistence: (wingEntity: WingEntity): WingPersistence => {
    const {
      uuid,
      pilotUuid,
      brand,
      model,
      flightTimePriorToOwn,
      ownerFrom,
      ownerUntil,
    } = wingEntity.getProps();
    return {
      id: wingEntity.getIdentity(),
      uuid,
      pilot_uuid: pilotUuid,
      brand,
      model,
      flight_time_prior_to_own: flightTimePriorToOwn,
      owner_from: ownerFrom,
      owner_until: ownerUntil ?? null,
    };
  },
  toEntity: ({
    id,
    uuid,
    pilot_uuid,
    brand,
    model,
    owner_from,
    owner_until,
    flight_time_prior_to_own,
  }: WingPersistence): WingEntity => {
    const wingEntity = WingEntity.fromDTO({
      uuid,
      pilotUuid: pilot_uuid,
      brand,
      model,
      ownerFrom: owner_from,
      ownerUntil: owner_until ?? undefined,
      flightTimePriorToOwn: flight_time_prior_to_own,
    });

    wingEntity.setIdentity(id);
    return wingEntity;
  },
  toDTO: ({
    uuid,
    pilot_uuid,
    brand,
    model,
    owner_from,
    owner_until,
    flight_time_prior_to_own,
  }: WingPersistence): WingDTO => ({
    uuid,
    pilotUuid: pilot_uuid,
    brand,
    model,
    ownerFrom: owner_from,
    ownerUntil: owner_until ?? undefined,
    flightTimePriorToOwn: flight_time_prior_to_own,
  }),
};
