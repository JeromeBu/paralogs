import { AuthGateway } from "./useCases/auth/gateways/AuthGateway";
import { ClientStorage } from "./useCases/auth/gateways/ClientStorage";
import { FlightGateway } from "./useCases/flights/gateways/FlightGateway";
import { PilotGateway } from "./useCases/pilot/gateways/PilotGateway";
import { WingGateway } from "./useCases/wings/gateways/WingGateway";

export interface Dependencies {
  authGateway: AuthGateway;
  wingGateway: WingGateway;
  flightGateway: FlightGateway;
  pilotGateway: PilotGateway;
  clientStorage: ClientStorage;
}
