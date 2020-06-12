import { Store } from "@reduxjs/toolkit";

import { InMemoryAuthGateway } from "./adapters/InMemoryAuthGateway";
import { InMemoryClientStorage } from "./adapters/InMemoryClientStorage";
import { InMemoryFlightGateway } from "./adapters/InMemoryFlightGateway";
import { InMemoryPilotGateway } from "./adapters/InMemoryPilotGateway";
import { InMemoryWingGateway } from "./adapters/InMemoryWingGateway";
import { RootState } from "./store/root-reducer";

type Partial2Levels<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<Partial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<Partial<U>>
    : Partial<T[P]>;
};

export const expectStateToMatchCreator = (
  initialState: RootState,
  store: Store,
) => (expectedState: Partial2Levels<RootState>) =>
  expect(store.getState()).toMatchObject({ ...initialState, ...expectedState });

export type ExpectStateToMatch = ReturnType<typeof expectStateToMatchCreator>;

export const getInMemoryDependencies = () => ({
  authGateway: new InMemoryAuthGateway(),
  wingGateway: new InMemoryWingGateway(),
  flightGateway: new InMemoryFlightGateway(),
  pilotGateway: new InMemoryPilotGateway(),
  clientStorage: new InMemoryClientStorage(),
});

export type InMemoryDependencies = ReturnType<typeof getInMemoryDependencies>;
