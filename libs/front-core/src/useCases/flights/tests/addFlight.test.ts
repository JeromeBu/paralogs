/**
 * @group unit
 */

import {
  FlightDTO,
  makeFlightDTO,
  makeWingDTO,
} from "@paralogs/logbook/interfaces";
import { Store } from "redux";

import { configureReduxStore } from "../../../reduxStore";
import { RootState } from "../../../store/root-reducer";
import {
  ExpectStateToMatch,
  expectStateToMatchCreator,
  getInMemoryDependencies,
  InMemoryDependencies,
} from "../../../testUtils";
import { flightActions } from "../flights.slice";

describe("Add a flight", () => {
  let store: Store<RootState>;
  let dependencies: InMemoryDependencies;
  let expectStateToMatch: ExpectStateToMatch;

  beforeEach(() => {
    dependencies = getInMemoryDependencies();
    store = configureReduxStore(dependencies);
    expectStateToMatch = expectStateToMatchCreator(store.getState(), store);
  });

  it("adds a new flight", () => {
    const wingDto = makeWingDTO();
    const flightDto = makeFlightDTO({ wingUuid: wingDto.uuid });
    addFlight(flightDto);
    feedWithFlight(flightDto);
    expectStateToMatch({
      flights: {
        data: [flightDto],
        isLoading: false,
        isSaving: false,
        isAddFlightFormVisible: false,
      },
    });
  });

  const feedWithFlight = (flight: FlightDTO) =>
    dependencies.flightGateway.flights$.next([flight]);

  const addFlight = (flight: FlightDTO) =>
    store.dispatch(flightActions.addFlightRequested(flight));
});
