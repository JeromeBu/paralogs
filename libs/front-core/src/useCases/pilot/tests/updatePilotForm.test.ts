/**
 * @group unit
 */

import { Store } from "redux";

import { configureReduxStore } from "../../../reduxStore";
import { RootState } from "../../../store/root-reducer";
import {
  ExpectStateToMatch,
  expectStateToMatchCreator,
  getInMemoryDependencies,
  InMemoryDependencies,
} from "../../../testUtils";
import { pilotActions } from "../pilot.slice";

describe("update Pilot form", () => {
  let store: Store<RootState>;
  let dependencies: InMemoryDependencies;
  let expectStateToMatch: ExpectStateToMatch;

  beforeEach(() => {
    dependencies = getInMemoryDependencies();
    store = configureReduxStore(dependencies);
    expectStateToMatch = expectStateToMatchCreator(store.getState(), store);
  });

  it("shows update Pilot form and then hides it", () => {
    store.dispatch(pilotActions.showUpdateForm());
    expectStateToMatch({ pilot: { isUpdateFormVisible: true } });

    store.dispatch(pilotActions.hideUpdateForm());
    expectStateToMatch({ pilot: { isUpdateFormVisible: false } });
  });
});
