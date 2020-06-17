import { Epic } from "redux-observable";
import { filter, map } from "rxjs/operators";

import { RootAction } from "../../../store/root-action";
import { RootState } from "../../../store/root-reducer";
import { Dependencies } from "../../../StoreDependencies";
import { authActions } from "../../auth/auth.slice";
import { pilotActions } from "../pilot.slice";

export const clearPilotInformationEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Dependencies
> = (action$) =>
  action$.pipe(
    filter(authActions.logoutSucceeded.match),
    map(() => pilotActions.pilotInformationSet(null)),
  );
