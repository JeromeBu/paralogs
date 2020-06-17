import { PilotDTO } from "@paralogs/logbook/interfaces";
import * as R from "ramda";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

import { PilotGateway } from "../useCases/pilot/gateways/PilotGateway";

const excludeNilValues = R.compose(R.not, R.isNil);

export class InMemoryPilotGateway implements PilotGateway {
  private _currentPilot$ = new BehaviorSubject<PilotDTO>(
    (undefined as unknown) as PilotDTO,
  );

  public retrieveCurrentPilot(): Observable<PilotDTO> {
    return this._currentPilot$.pipe(filter(excludeNilValues));
  }
}
