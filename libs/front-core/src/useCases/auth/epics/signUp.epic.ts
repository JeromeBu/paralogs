import { Epic } from "redux-observable";
import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { handleActionError } from "../../../actionsUtils";
import { RootState } from "../../../store/root-reducer";
import { Dependencies } from "../../../StoreDependencies";
import { AuthAction, authActions } from "../auth.slice";

export const signUpEpic: Epic<
  AuthAction,
  AuthAction,
  RootState,
  Dependencies
> = (action$, state$, { authGateway, clientStorage }) =>
  action$.pipe(
    filter(authActions.signUpRequested.match),
    switchMap(({ payload }) => {
      return authGateway.signUp(payload).pipe(
        switchMap((currentUserWithToken) => {
          clientStorage.set("token", currentUserWithToken.token);
          return of(currentUserWithToken);
        }),
        map(authActions.authenticationSucceeded),
        catchError(handleActionError(authActions.signUpFailed)),
      );
    }),
  );
