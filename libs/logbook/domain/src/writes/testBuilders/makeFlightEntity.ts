import { FlightDTO, makeFlightDTO } from "@paralogs/logbook/interfaces";

import { FlightEntity } from "../entities/FlightEntity";

export const makeFlightEntity = (
  flightParams?: Partial<FlightDTO>,
): FlightEntity => {
  const flightDto = makeFlightDTO(flightParams);
  return FlightEntity.create(flightDto)
    .ifLeft((error) => {
      throw error;
    })
    .extract() as FlightEntity;
};
