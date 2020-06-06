import * as R from "ramda";

import { FlightDTO } from "../DTOs";
import { generateUuid } from "../generalTypes/uuid";
import { makeWingDTO } from "./makeWingDTO";

export const makeFlightDTO = (
  flightParams: Partial<FlightDTO> = {},
): FlightDTO => {
  const randomFlight: FlightDTO = {
    uuid: generateUuid(),
    pilotUuid: generateUuid(),
    wingUuid: makeWingDTO().uuid,
    date: new Date().toUTCString(),
    site: "La scia",
    time: "12h30",
    duration: 55,
  };

  const flight = R.merge(randomFlight, flightParams);
  return flight;
};
