/**
 * @group unit
 */

import { makeUserDTO, PilotUuid } from "@paralogs/shared";
import { Store } from "redux";

import { configureReduxStore } from "../../../reduxStore";
import { RootState } from "../../../store/root-reducer";
import {
  ExpectStateToMatch,
  expectStateToMatchCreator,
  getInMemoryDependencies,
  InMemoryDependencies,
} from "../../../testUtils";
import { authActions } from "../../auth/auth.slice";

describe("set pilot information", () => {
  let store: Store<RootState>;
  let dependencies: InMemoryDependencies;
  let expectStateToMatch: ExpectStateToMatch;

  beforeEach(() => {
    dependencies = getInMemoryDependencies();
    store = configureReduxStore(dependencies);
    expectStateToMatch = expectStateToMatchCreator(store.getState(), store);
  });

  describe("when user authenticates successfully", () => {
    it("sets correctly the pilot information", async () => {
      const currentUser = makeUserDTO();
      const token = "someFakeToken";

      store.dispatch(
        authActions.authenticationSucceeded({
          currentUser,
          token,
        }),
      );

      expectStateToMatch({
        auth: {
          currentUser,
          token,
        },
        pilot: {
          data: {
            uuid: currentUser.uuid as PilotUuid,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
          },
        },
      });
    });
  });
});
