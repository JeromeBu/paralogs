import {
  addFlightCommandHandlerCreator,
  addWingCommandHandlerCreator,
  createPilotCommandHandlerCreator,
  retrieveFlightsRead,
  retrieveWingsRead,
  updatePilotCommandHandlerCreator,
  updateWingCommandHandlerCreator,
} from "@paralogs/logbook/domain";
import { queries, repositories } from "./secondaryAdaptersChoice";

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
