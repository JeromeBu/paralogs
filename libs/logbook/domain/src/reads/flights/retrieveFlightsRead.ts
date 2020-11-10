import { ResultAsync } from "@paralogs/shared/back";
import { FlightDTO, PilotUuid } from "@paralogs/logbook/interfaces";
import { EitherAsync } from "purify-ts";

import { FlightQueries } from "../gateways/FlightQueries";

interface RetrieveFlightsDependencies {
  flightQueries: FlightQueries;
}

export const retrieveFlightsRead = ({
  flightQueries,
}: RetrieveFlightsDependencies) => (
  currentUserUuid: PilotUuid,
): ResultAsync<FlightDTO[]> => {
  return EitherAsync(() => flightQueries.findByPilotUuid(currentUserUuid));
};

export type RetrieveFlightsRead = ReturnType<typeof retrieveFlightsRead>;
