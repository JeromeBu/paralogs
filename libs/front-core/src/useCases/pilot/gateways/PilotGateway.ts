import { PilotDTO } from "@paralogs/shared";
import { Observable } from "rxjs";

export interface PilotGateway {
  retrieveCurrentPilot(): Observable<PilotDTO>;
}
