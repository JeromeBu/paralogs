import { ValueOf } from "@paralogs/shared";

import { AuthAction, authActions } from "../useCases/auth/auth.slice";
import { FlightAction, flightActions } from "../useCases/flights/flights.slice";
import { PilotAction, pilotActions } from "../useCases/pilot/pilot.slice";
import { WingAction, wingActions } from "../useCases/wings/wings.slice";

const actionCreators = {
  currentUser: authActions,
  flight: flightActions,
  wing: wingActions,
  pilot: pilotActions,
};

export type RootActionCreator = ValueOf<typeof actionCreators>;

export type RootAction = AuthAction | WingAction | FlightAction | PilotAction;
