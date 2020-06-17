import { Epic } from "redux-observable";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { handleActionError } from "../../../actionsUtils";
import { RootState } from "../../../store/root-reducer";
import { Dependencies } from "../../../StoreDependencies";
import { FlightAction, flightActions } from "../flights.slice";

export const addFlightEpic: Epic<
  FlightAction,
  FlightAction,
  RootState,
  Dependencies
> = (action$, state$, { flightGateway }) =>
  action$.pipe(
    filter(flightActions.addFlightRequested.match),
    switchMap(({ payload }) =>
      flightGateway.addFlight(payload).pipe(
        // map(flightActions.addedFlight),
        map(flightActions.retrieveFlightsRequested),
        catchError(handleActionError(flightActions.addFlightFailed)),
      ),
    ),
  );
