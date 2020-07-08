/**
 * @group unit
 */

import { Result } from "@paralogs/shared/back";
import { expectEitherToMatchError } from "@paralogs/shared/back-test-helpers";
import { CurrentUserWithAuthToken } from "@paralogs/auth/interface";
import { Hasher } from "../writes/gateways/Hasher";
import {
  TestTokenManager,
  InMemoryUserRepo,
} from "../writes/gateways/testImplementations";
import { TestHasher } from "../writes/gateways/testImplementations/TestHasher";
import { makeUserEntityCreator } from "../writes/testBuilders/makeUserEntityCreator";
import { loginRead } from "./loginRead";

describe("User Login", () => {
  let tokenManager: TestTokenManager;
  let hasher: Hasher;
  let login: ReturnType<typeof loginRead>;
  let userRepo: InMemoryUserRepo;
  let makeUserEntity: ReturnType<typeof makeUserEntityCreator>;

  beforeEach(() => {
    tokenManager = new TestTokenManager();
    hasher = new TestHasher();
    userRepo = new InMemoryUserRepo();
    login = loginRead({
      userRepo,
      hasher,
    });
    makeUserEntity = makeUserEntityCreator({ tokenManager, hasher });
  });

  describe("Email is not valid", () => {
    it("warns that email is not valid", async () => {
      const response = await login({
        email: "not an email",
        password: "whatever",
      }).run();
      expectEitherToMatchError(response, "Not a valid Email");
    });
  });

  describe("Email does not match any user", () => {
    it("warns no user found", async () => {
      const response = await login({
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
      const response = await login({
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
      tokenManager.setGeneratedToken(jwtToken);
      const userEntity = await makeUserEntity({
        email,
        password,
        firstName,
        lastName,
      });
      userRepo.setUsers([userEntity]);
      const response = await login({
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
