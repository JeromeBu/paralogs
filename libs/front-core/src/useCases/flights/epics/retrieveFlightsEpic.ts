import { Epic } from "redux-observable";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { handleActionError, matchActions } from "../../../actionsUtils";
import { RootAction } from "../../../store/root-action";
import { RootState } from "../../../store/root-reducer";
import { Dependencies } from "../../../StoreDependencies";
import { authActions } from "../../auth/auth.slice";
import { flightActions } from "../flights.slice";

export const retrieveFlightsEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Dependencies
> = (action$, state$, { flightGateway }) =>
  action$.pipe(
    filter(
      matchActions(
        flightActions.retrieveFlightsRequested,
        authActions.authenticationSucceeded,
      ),
    ),
    switchMap(() =>
      flightGateway
        .retrieveFlights()
        .pipe(
          map(flightActions.retrieveFlightsSucceeded),
          catchError(handleActionError(flightActions.retrieveFlightsFailed)),
        ),
    ),
  );
