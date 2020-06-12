import { AddWingDTO, UpdateWingDTO } from "@paralogs/shared";

import { WingGateway } from "../useCases/wings/gateways/WingGateway";
import { httpClient } from "./libs/httpClient";

export class HttpWingGateway implements WingGateway {
  public retrieveWings() {
    return httpClient.retrieveWings()();
  }

  public addWing(addWingDTO: AddWingDTO) {
    return httpClient.addWing()(addWingDTO);
  }

  public updateWing(updateWingDTO: UpdateWingDTO) {
    return httpClient.updateWing()(updateWingDTO);
  }
}
