import { ResultAsync } from "@paralogs/shared/back";
import { FlightDTO, PilotUuid } from "@paralogs/logbook/interfaces";
import { liftPromise } from "purify-ts/EitherAsync";

import { FlightQueries } from "../gateways/FlightQueries";

interface RetrieveFlightsDependencies {
  flightQueries: FlightQueries;
}

export const retrieveFlightsRead = ({
  flightQueries,
}: RetrieveFlightsDependencies) => (
  currentUserUuid: PilotUuid,
): ResultAsync<FlightDTO[]> => {
  return liftPromise(() => flightQueries.findByPilotUuid(currentUserUuid));
};

export type RetrieveFlightsRead = ReturnType<typeof retrieveFlightsRead>;
