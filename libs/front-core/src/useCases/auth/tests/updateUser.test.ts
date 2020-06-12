import { makeUserDTO, UserDTO } from "@paralogs/shared";
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

describe("update user ", () => {
  let store: Store<RootState>;
  let dependencies: InMemoryDependencies;
  let expectStateToMatch: ExpectStateToMatch;

  beforeEach(() => {
    dependencies = getInMemoryDependencies();
    store = configureReduxStore(dependencies);
    expectStateToMatch = expectStateToMatchCreator(store.getState(), store);
  });

  describe("when all is good", () => {
    it("updates the user with the provided data", async () => {
      const currentUser = makeUserDTO();
      const token = "someFakeToken";

      store.dispatch(
        authActions.authenticationSucceeded({
          currentUser,
          token,
        }),
      );
      const loggedState = store.getState();

      const updateParams = {
        uuid: currentUser.uuid,
        firstName: "NewFirstName",
        lastName: "NewLastName",
      };
      feedWithUserDTO({ ...currentUser, ...updateParams }, token);
      store.dispatch(authActions.updateUserRequested(updateParams));
      expectStateToMatch({
        ...loggedState,
        auth: {
          currentUser: { ...updateParams, email: currentUser.email },
          token,
        },
      });
    });

    const feedWithUserDTO = (userDTO: UserDTO, token: string) => {
      dependencies.authGateway.currentUserWithToken$.next({
        currentUser: userDTO,
        token,
      });
    };
  });
});
