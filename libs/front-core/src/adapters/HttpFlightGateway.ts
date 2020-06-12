import { AddFlightDTO } from "@paralogs/shared";

import { FlightGateway } from "../useCases/flights/gateways/FlightGateway";
import { httpClient } from "./libs/httpClient";

export class HttpFlightGateway implements FlightGateway {
  retrieveFlights() {
    return httpClient.retrieveFlights()();
  }

  addFlight(addFlightDto: AddFlightDTO) {
    return httpClient.addFlight()(addFlightDto);
  }
}
