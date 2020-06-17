import { CurrentUserWithAuthToken } from "@paralogs/shared";

import { InMemoryDependencies } from "../../../testUtils";

export const feedWithCurrentUserCreator = (
  dependencies: InMemoryDependencies,
) => (userDTOWithAuthToken: CurrentUserWithAuthToken) => {
  dependencies.authGateway.currentUserWithToken$.next(userDTOWithAuthToken);
};
export const feedWithAuthErrorCreator = (
  dependencies: InMemoryDependencies,
) => (errorMessage: string) => {
  dependencies.authGateway.currentUserWithToken$.error(errorMessage);
};
