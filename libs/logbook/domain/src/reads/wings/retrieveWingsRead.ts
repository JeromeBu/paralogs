import { ResultAsync } from "@paralogs/shared/back";
import { PilotUuid, WingDTO } from "@paralogs/logbook/interfaces";
import { EitherAsync } from "purify-ts";

import { WingQueries } from "../gateways/WingQueries";

interface RetrieveWingsDependencies {
  wingQueries: WingQueries;
}

export const retrieveWingsRead = ({
  wingQueries,
}: RetrieveWingsDependencies) => (
  currentUserUuid: PilotUuid,
): ResultAsync<WingDTO[]> => {
  return EitherAsync(() => wingQueries.findByPilotUuid(currentUserUuid));
};
