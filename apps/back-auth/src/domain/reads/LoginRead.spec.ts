/**
 * @group unit
 */

import { expectEitherToMatchError, Result } from "@paralogs/back-shared";
import { CurrentUserWithAuthToken } from "@paralogs/shared";

import { InMemoryUserRepo } from "../../adapters/secondaries/persistence/inMemory/InMemoryUserRepo";
import { TestHashAndTokenManager } from "../../adapters/secondaries/TestHashAndTokenManager";
import { makeUserEntityCreator } from "../writes/testBuilders/makeUserEntityCreator";
import { LoginRead, loginReadCreator } from "./LoginRead";

describe("User Login", () => {
  let hashAndTokenManager: TestHashAndTokenManager;
  let loginUseCase: LoginRead;
  let userRepo: InMemoryUserRepo;
  let makeUserEntity: ReturnType<typeof makeUserEntityCreator>;

  beforeEach(() => {
    hashAndTokenManager = new TestHashAndTokenManager();
    userRepo = new InMemoryUserRepo();
    loginUseCase = loginReadCreator({
      userRepo,
      hashAndTokenManager,
    });
    makeUserEntity = makeUserEntityCreator(hashAndTokenManager);
  });

  describe("Email is not valid", () => {
    it("warns that email is not valid", async () => {
      const response = await loginUseCase({
        email: "not an email",
        password: "whatever",
      }).run();
      expectEitherToMatchError(response, "Not a valid Email");
    });
  });

  describe("Email does not match any user", () => {
    it("warns no user found", async () => {
      const response = await loginUseCase({
        email: "notFound@mail.com",
        password: "whatever",
      }).run();
      expectEitherToMatchError(response, "No user found");
    });
  });

  describe("Password is wrong", () => {
    it("warns password is wrong", async () => {
      const email = "john.Doe@mail.com";
      userRepo.setUsers([await makeUserEntity({ email })]);
      const response = await loginUseCase({
        email,
        password: "wrongPassword",
      }).run();
      expectEitherToMatchError(response, "Wrong password");
    });
  });

  describe("Email and Password are good", () => {
    it("sends current user and authentication token", async () => {
      const email = "john.doe@mail.com";
      const firstName = "John";
      const lastName = "Doe";
      const password = "Secret123";
      const jwtToken = "someFakeToken";
      hashAndTokenManager.setGeneratedToken(jwtToken);
      const userEntity = await makeUserEntity({
        email,
        password,
        firstName,
        lastName,
      });
      userRepo.setUsers([userEntity]);
      const response = await loginUseCase({
        email,
        password,
      }).run();

      expectUserResultToEqual(response, {
        token: jwtToken,
        currentUser: {
          uuid: userEntity.uuid,
          email,
          firstName,
          lastName,
        },
      });
    });
  });

  const expectUserResultToEqual = (
    result: Result<CurrentUserWithAuthToken>,
    expectedUserDTOWithToken: CurrentUserWithAuthToken,
  ) =>
    result.map((userDTO) => expect(userDTO).toEqual(expectedUserDTOWithToken));
});
