import { PilotDTO } from "@paralogs/logbook/interfaces";
import { Observable } from "rxjs";

export interface PilotGateway {
  retrieveCurrentPilot(): Observable<PilotDTO>;
}
