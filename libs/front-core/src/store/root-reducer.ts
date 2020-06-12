import { combineReducers } from "@reduxjs/toolkit";

import { authReducer } from "../useCases/auth/auth.slice";
import { flightsReducer } from "../useCases/flights/flights.slice";
import { pilotReducer } from "../useCases/pilot/pilot.slice";
import { wingsReducer } from "../useCases/wings/wings.slice";

export const rootReducer = combineReducers({
  auth: authReducer,
  flights: flightsReducer,
  wings: wingsReducer,
  pilot: pilotReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
