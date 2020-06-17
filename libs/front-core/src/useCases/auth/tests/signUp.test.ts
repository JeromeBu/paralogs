import {
  CurrentUserWithAuthToken,
  makeUserDTO,
  SignUpParams,
} from "@paralogs/auth/interface";
import { PilotUuid } from "@paralogs/logbook/interfaces";
import { Store } from "redux";

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

describe("Sign up", () => {
  let store: Store<RootState>;
  let dependencies: InMemoryDependencies; /* cannot be typed Dependencies because we need to access .currentUser$ */
  let feedWithCurrentUser: (params: CurrentUserWithAuthToken) => void;
  let feedWithError: (errorMessage: string) => void;
  let expectStateToMatch: ExpectStateToMatch;

  beforeEach(() => {
    dependencies = getInMemoryDependencies();
    store = configureReduxStore(dependencies);
    feedWithCurrentUser = feedWithCurrentUserCreator(dependencies);
    feedWithError = feedWithAuthErrorCreator(dependencies);
    expectStateToMatch = expectStateToMatchCreator(store.getState(), store);
  });

  describe("Sign up successfully", () => {
    it("retrieve user and his authentication info", () => {
      const email = "jerome@mail.com";
      const password = "password";
      const firstName = "John";
      const lastName = "Doe";

      const currentUser = makeUserDTO({ email, firstName, lastName });
      const token = "someFakeToken";

      signUpUser({ email, password, firstName, lastName });
      feedWithCurrentUser({ currentUser, token });
      expectStateToMatch({
        auth: {
          currentUser,
          isLoading: false,
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
      expectTokenToBeStoredInClientStorage(token);
    });
  });

  describe("when email already exists", () => {
    it("refuses to sign up", () => {
      const email = "jerome@mail.com";
      const password = "password";
      const firstName = "John";
      const lastName = "Doe";

      const errorMessage =
        "This email is already used, consider logging in instead";

      signUpUser({ email, password, firstName, lastName });
      feedWithError(errorMessage);
      expectStateToMatch({
        auth: {
          isLoading: false,
          error: errorMessage,
          token: null,
          currentUser: null,
        },
      });
    });
  });

  const signUpUser = (signUpParams: SignUpParams) => {
    store.dispatch(authActions.signUpRequested(signUpParams));
  };

  const expectTokenToBeStoredInClientStorage = (token: string) => {
    expect(dependencies.clientStorage.get("token")).toBe(token);
  };
});
