import { AddFlightDTO, FlightDTO, generateUuid } from "@paralogs/shared";
import { BehaviorSubject, of } from "rxjs";

import { FlightGateway } from "../useCases/flights/gateways/FlightGateway";

export class InMemoryFlightGateway implements FlightGateway {
  private _flights$ = new BehaviorSubject<FlightDTO[]>([]);

  retrieveFlights() {
    return this._flights$;
  }

  addFlight(addFlightDto: AddFlightDTO) {
    const flightDto: FlightDTO = { ...addFlightDto, pilotUuid: generateUuid() };
    return of(flightDto);
  }

  get flights$() {
    return this._flights$;
  }
}
