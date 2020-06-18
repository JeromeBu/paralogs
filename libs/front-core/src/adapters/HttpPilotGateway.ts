import { PilotDTO } from "@paralogs/logbook/interfaces";
import { Observable } from "rxjs";

import { PilotGateway } from "../useCases/pilot/gateways/PilotGateway";
import { httpClient } from "./libs/httpClient";

export class HttpPilotGateway implements PilotGateway {
  public retrieveCurrentPilot(): Observable<PilotDTO> {
    return httpClient.retrieveCurrentPilot()();
  }
}
