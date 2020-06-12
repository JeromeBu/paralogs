import { PilotUuid } from "@paralogs/shared";
import { Epic } from "redux-observable";
import { filter, map } from "rxjs/operators";

import { RootAction } from "../../../store/root-action";
import { RootState } from "../../../store/root-reducer";
import { Dependencies } from "../../../StoreDependencies";
import { authActions } from "../../auth/auth.slice";
import { pilotActions } from "../pilot.slice";

export const setPilotInformationEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Dependencies
> = (action$) =>
  action$.pipe(
    filter(authActions.authenticationSucceeded.match),
    map(
      ({
        payload: {
          currentUser: { uuid, firstName, lastName },
        },
      }) => {
        return pilotActions.retrievedCurrentPilotSucceeded({
          uuid: uuid as PilotUuid,
          firstName,
          lastName,
        });
      },
    ),
  );

// switchMap(() =>
//   pilotGateway
//     .retrieveCurrentPilot()
//     .pipe(
//       map(pilotActions.retrievedCurrentPilotSucceeded),
//       catchError(
//         handleActionError(pilotActions.retrievedCurrentPilotFailed),
//       ),
//     ),
// ),
