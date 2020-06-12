import { AddFlightDTO, FlightDTO } from "@paralogs/shared";
import { Observable } from "rxjs";

export interface FlightGateway {
  retrieveFlights(): Observable<FlightDTO[]>;
  addFlight(
    addFlightDto: AddFlightDTO,
  ): Observable<FlightDTO> /* QUESTION: return null, void or FlightDTO ? */;
}
