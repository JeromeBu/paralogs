import { Epic } from "redux-observable";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { handleActionError } from "../../../actionsUtils";
import { RootAction } from "../../../store/root-action";
import { RootState } from "../../../store/root-reducer";
import { Dependencies } from "../../../StoreDependencies";
import { wingActions } from "../wings.slice";

export const updateWingEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Dependencies
> = (action$, state$, { wingGateway }) =>
  action$.pipe(
    filter(wingActions.updateWingRequested.match),
    switchMap(({ payload }) =>
      wingGateway
        .updateWing(payload)
        .pipe(
          map(wingActions.updateWingSucceeded),
          catchError(handleActionError(wingActions.updateWingFailed)),
        ),
    ),
  );
