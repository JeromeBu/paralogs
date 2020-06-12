import { Store } from "@reduxjs/toolkit";

import { HttpAuthGateway } from "./adapters/HttpAuthGateway";
import { HttpFlightGateway } from "./adapters/HttpFlightGateway";
import { HttpPilotGateway } from "./adapters/HttpPilotGateway";
import { HttpWingGateway } from "./adapters/HttpWingGateway";
import { LocalClientStorage } from "./adapters/LocalClientStorage";
import { configureReduxStore } from "./reduxStore";
import { RootState as _RootState } from "./store/root-reducer";

export type ReduxStore = Store<_RootState>;

export type RootState = _RootState;

export const store: ReduxStore = configureReduxStore({
  authGateway: new HttpAuthGateway(),
  wingGateway: new HttpWingGateway(),
  flightGateway: new HttpFlightGateway(),
  pilotGateway: new HttpPilotGateway(),
  clientStorage: new LocalClientStorage(),
});
