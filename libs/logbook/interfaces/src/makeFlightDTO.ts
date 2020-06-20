import * as R from "ramda";
import { generateUuid } from "@paralogs/shared/common";

import { FlightDTO } from "./FlightDTOs";
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
