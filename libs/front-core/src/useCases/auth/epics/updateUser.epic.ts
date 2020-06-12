import { Epic } from "redux-observable";
import { filter, map, switchMap } from "rxjs/operators";

import { RootAction } from "../../../store/root-action";
import { RootState } from "../../../store/root-reducer";
import { Dependencies } from "../../../StoreDependencies";
import { authActions } from "../auth.slice";

export const updateUserEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Dependencies
> = (action$, state$, { authGateway }) =>
  action$.pipe(
    filter(authActions.updateUserRequested.match),
    switchMap(({ payload }) =>
      authGateway
        .updateUser(payload)
        .pipe(map(authActions.updateUserSucceeded)),
    ),
  );
