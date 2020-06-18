import { FlightDTO } from "@paralogs/logbook/interfaces";

import { FlightEntity } from "@paralogs/logbook/domain";
import { FlightPersistence } from "./FlightPersistence";

export const flightPersistenceMapper = {
  toPersistence: (flightEntity: FlightEntity): FlightPersistence => {
    const {
      uuid,
      pilotUuid,
      wingUuid,
      date,
      duration,
      site,
      time,
    } = flightEntity.getProps();
    return {
      id: flightEntity.getIdentity(),
      uuid,
      pilot_uuid: pilotUuid,
      wing_uuid: wingUuid,
      date,
      duration,
      site,
      time: time || null,
    };
  },

  toEntity: ({
    id,
    uuid,
    wing_uuid,
    pilot_uuid,
    time,
    site,
    duration,
    date,
  }: FlightPersistence) => {
    const flightEntity = FlightEntity.fromDTO({
      uuid,
      pilotUuid: pilot_uuid,
      wingUuid: wing_uuid,
      time: time ?? undefined,
      site,
      duration,
      date,
    });
    flightEntity.setIdentity(id);
    return flightEntity;
  },
  toDTO: ({
    uuid,
    wing_uuid,
    pilot_uuid,
    time,
    site,
    duration,
    date,
  }: FlightPersistence): FlightDTO => ({
    uuid,
    pilotUuid: pilot_uuid,
    wingUuid: wing_uuid,
    time: time ?? undefined,
    site,
    duration,
    date,
  }),
};
