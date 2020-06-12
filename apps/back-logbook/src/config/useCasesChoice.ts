import { retrieveFlightsRead } from "../domain/reads/flights/retrieveFlightsRead";
import { retrieveWingsRead } from "../domain/reads/wings/retrieveWingsRead";
import { addFlightCommandHandlerCreator } from "../domain/writes/commandHandlers/flights/AddFlightCommandHandler";
import { createPilotCommandHandlerCreator } from "../domain/writes/commandHandlers/pilots/CreatePilotCommandHandler";
import { updatePilotCommandHandlerCreator } from "../domain/writes/commandHandlers/pilots/UpdatePilotCommandHandler";
import { addWingCommandHandlerCreator } from "../domain/writes/commandHandlers/wings/AddWingCommandHandler";
import { updateWingCommandHandlerCreator } from "../domain/writes/commandHandlers/wings/UpdateWingCommandHandler";
import { queries,repositories } from "./secondaryAdaptersChoice";

export const pilotsUseCases = {
  create: createPilotCommandHandlerCreator({ pilotRepo: repositories.pilot }),
  update: updatePilotCommandHandlerCreator({ pilotRepo: repositories.pilot }),
};

export const wingsUseCases = {
  addWing: addWingCommandHandlerCreator({ wingRepo: repositories.wing }),
  retrieveWings: retrieveWingsRead({ wingQueries: queries.wing }),
  updateWing: updateWingCommandHandlerCreator({
    wingRepo: repositories.wing,
  }),
};

export const flightsUseCases = {
  addFlight: addFlightCommandHandlerCreator({
    flightRepo: repositories.flight,
  }),
  retrieveFlights: retrieveFlightsRead({ flightQueries: queries.flight }),
};
