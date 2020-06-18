import { AddFlightDTO, FlightDTO } from "@paralogs/logbook/interfaces";
import { Observable } from "rxjs";

export interface FlightGateway {
  retrieveFlights(): Observable<FlightDTO[]>;
  addFlight(
    addFlightDto: AddFlightDTO,
  ): Observable<FlightDTO> /* QUESTION: return null, void or FlightDTO ? */;
}
