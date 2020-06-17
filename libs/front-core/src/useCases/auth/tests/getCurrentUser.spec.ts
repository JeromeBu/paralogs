import {
  CurrentUserWithAuthToken,
  makeUserDTO,
} from "@paralogs/auth/interface";
import { PilotUuid } from "@paralogs/logbook/interfaces";
import { Store } from "@reduxjs/toolkit";

import { configureReduxStore } from "../../../reduxStore";
import { RootState } from "../../../store/root-reducer";
import {
  ExpectStateToMatch,
  expectStateToMatchCreator,
  getInMemoryDependencies,
  InMemoryDependencies,
} from "../../../testUtils";
import { authActions } from "../auth.slice";
import {
  feedWithAuthErrorCreator,
  feedWithCurrentUserCreator,
} from "./auth.testUtils";

describe("GetMe :  recover current user information", () => {
  let store: Store<RootState>;
  let dependencies: InMemoryDependencies;
  let feedWithCurrentUser: (params: CurrentUserWithAuthToken) => void;
  let feedWithError: (errorMessage: string) => void;
  let expectStateToMatch: ExpectStateToMatch;

  beforeEach(() => {
    dependencies = getInMemoryDependencies();
    store = configureReduxStore(dependencies);
    feedWithError = feedWithAuthErrorCreator(dependencies);
    feedWithCurrentUser = feedWithCurrentUserCreator(dependencies);
    expectStateToMatch = expectStateToMatchCreator(store.getState(), store);
  });

  describe("No one is logged in", () => {
    it("warns the user with a message", () => {
      const errorMessage = "You need to authenticate first";

      getCurrentUser();
      feedWithError(errorMessage);
      expectStateToMatch({
        auth: {
          error: errorMessage,
          token: null,
          isLoading: false,
        },
      });
    });
  });

  describe("You are logged in", () => {
    it("recovers current user information", () => {
      const currentUser = makeUserDTO();
      const token = "someFakeToken";
      getCurrentUser();
      feedWithCurrentUser({
        currentUser,
        token,
      });
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
      expect(dependencies.clientStorage.get("token")).toBe(token);
    });
  });

  const getCurrentUser = () => store.dispatch(authActions.getMeRequested());
});
