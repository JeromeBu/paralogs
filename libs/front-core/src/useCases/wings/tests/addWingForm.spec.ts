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
import { wingActions } from "../wings.slice";

describe("Add a wing", () => {
  let store: Store<RootState>;
  let dependencies: InMemoryDependencies;
  let expectStateToMatch: ExpectStateToMatch;

  beforeEach(() => {
    dependencies = getInMemoryDependencies();
    store = configureReduxStore(dependencies);
    expectStateToMatch = expectStateToMatchCreator(store.getState(), store);
  });

  it("shows add wing form, then hides it", () => {
    store.dispatch(wingActions.showAddWingForm());
    expectStateToMatch({
      wings: {
        isAddWingFormVisible: true,
      },
    });
    store.dispatch(wingActions.hideAddWingForm());
    expectStateToMatch({
      wings: {
        isAddWingFormVisible: false,
      },
    });
  });
});
