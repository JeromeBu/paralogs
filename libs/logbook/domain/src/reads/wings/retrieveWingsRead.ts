import { ResultAsync } from "@paralogs/shared/back";
import { PilotUuid, WingDTO } from "@paralogs/logbook/interfaces";
import { liftPromise } from "purify-ts/EitherAsync";

import { WingQueries } from "../gateways/WingQueries";

interface RetrieveWingsDependencies {
  wingQueries: WingQueries;
}

export const retrieveWingsRead = ({
  wingQueries,
}: RetrieveWingsDependencies) => (
  currentUserUuid: PilotUuid,
): ResultAsync<WingDTO[]> => {
  return liftPromise(() => wingQueries.findByPilotUuid(currentUserUuid));
};
