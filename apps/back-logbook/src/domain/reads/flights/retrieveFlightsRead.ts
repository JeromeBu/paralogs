import { ResultAsync } from "@paralogs/back/shared";
import { FlightDTO, PilotUuid } from "@paralogs/shared";
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
