import {
  CurrentUserWithAuthToken,
  makeUserDTO,
  PilotUuid,
} from "@paralogs/shared";
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

describe("Login", () => {
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

  describe("Email and password are correct", () => {
    it("returns logged user with authentication token", () => {
      const email = "auth@works.com";
      const currentUser = makeUserDTO({ email });
      const password = "password";
      const token = "fakeLoginToken";
      loginUser({ email, password });
      feedWithCurrentUser({ currentUser, token });
      expectStateToMatch({
        auth: {
          isLoading: false,
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
      expectTokenToBeStoredInClientStorage(token);
    });
  });

  describe("When email or password is wrong", () => {
    it("refuses to log in with an explicit message", () => {
      const email = "already@used.com";
      const password = "wrongPassword";
      const errorMessage = "Email or password is incorrect...";
      loginUser({ email, password });
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

  const loginUser = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => store.dispatch(authActions.loginRequested({ email, password }));

  const expectTokenToBeStoredInClientStorage = (token: string) => {
    expect(dependencies.clientStorage.get("token")).toBe(token);
  };
});
