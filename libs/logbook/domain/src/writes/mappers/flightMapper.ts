import { FlightDTO } from "@paralogs/logbook/interfaces";

import { FlightEntity } from "../entities/FlightEntity";

export const flightMapper = {
  entityToDTO: (flightEntity: FlightEntity): FlightDTO =>
    flightEntity.getProps(),
};
