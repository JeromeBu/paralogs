/**
 * @group unit
 */

import { MakeUserEntity, makeUserEntityCreator } from "@paralogs/auth/domain";
import * as R from "ramda";
import {
  CurrentUserWithAuthToken,
  SignUpParams,
  UserUuid,
} from "@paralogs/auth/interface";
import {
  createInMemoryEventBus,
  InMemoryEventBus,
  Result,
} from "@paralogs/shared/back";
import {
  createExpectDispatchedEvent,
  expectEitherToMatchError,
} from "@paralogs/shared/back-test-helpers";
import { generateUuid } from "@paralogs/shared/common";
import { Hasher } from "../gateways/Hasher";

import {
  InMemoryUserRepo,
  TestTokenManager,
} from "../gateways/testImplementations";
import { UserEntity } from "../entities/UserEntity";
import { TestHasher } from "../gateways/testImplementations/TestHasher";
import {
  SignUpCommandHandler,
  signUpCommandHandler,
} from "./signUpCommandHandler";

describe("User signUp", () => {
  let userUuid: UserUuid;
  let tokenManager: TestTokenManager;
  let hasher: Hasher;
  let signUpUseCase: SignUpCommandHandler;
  let userRepo: InMemoryUserRepo;
  let eventBus: InMemoryEventBus;
  let expectDispatchedEvent: any;
  let makeUserEntity: MakeUserEntity;
  const getNow = () => new Date("2020-01-01");

  beforeEach(() => {
    userUuid = generateUuid();
    userRepo = new InMemoryUserRepo();
    tokenManager = new TestTokenManager();
    hasher = new TestHasher();
    makeUserEntity = makeUserEntityCreator({ tokenManager, hasher });
    eventBus = createInMemoryEventBus({ getNow });
    expectDispatchedEvent = createExpectDispatchedEvent(eventBus);
    signUpUseCase = signUpCommandHandler({
      eventBus,
      userRepo,
      tokenManager,
      hasher,
    });
  });

  describe("email is not the write format", () => {
    it("fails to signUp with an explicit message", async () => {
      const result = await signUp({ email: "mail.com" });
      expectEitherToMatchError(result, "Not a valid Email");
      expect(userRepo.users.length).toBe(0);
    });
  });

  describe("email is already taken", () => {
    it("fails to signUp with an explicit message", async () => {
      const email = "some@mail.com";
      await populateWithUserWithEmail(email);
      const result = await signUp({ email });
      expectEitherToMatchError(
        result,
        "Email is already taken. Consider logging in.",
      );
      expect(userRepo.users.length).toBe(1);
    });
  });

  const populateWithUserWithEmail = async (email: string) => {
    const preexistingUser = await makeUserEntity({ email });
    userRepo.setUsers([preexistingUser]);
  };

  describe("password doesn't match criteria", () => {
    it("fails to signUp with an explicit message", async () => {
      const signUpParamsCases = [
        "toShort",
        "nouppercar",
        "NOLOWERCHAR",
      ].map((password) => buildSignUpParams({ password }));
      const [toShortResult, noUpperResult, noLowerResult] = await Promise.all(
        signUpParamsCases.map((params) => signUpUseCase(params).run()),
      );
      expectEitherToMatchError(
        toShortResult,
        "Password must be at least 8 characters long",
      );
      expectEitherToMatchError(
        noUpperResult,
        "Password must have upper case characters",
      );
      expectEitherToMatchError(
        noLowerResult,
        "Password must have lower case characters",
      );
    });
  });

  describe("all is good", () => {
    it("signs up a user, reformat and trim email and names", async () => {
      const someFakeToken = "someFakeToken";
      tokenManager.setGeneratedToken(someFakeToken);

      const currentUserWithToken = await signUp({
        uuid: userUuid,
        email: " jOhN@mAil.com ",
        firstName: " john",
        lastName: "doe ",
      });

      const expectedUser = {
        uuid: userUuid,
        email: "john@mail.com",
        firstName: "John",
        lastName: "Doe",
      };

      expectUserResultToEqual(currentUserWithToken, {
        currentUser: expectedUser,
        token: someFakeToken,
      });
      const userEntity = userRepo.users[0];
      expect(userEntity.uuid).toEqual(userUuid);
      expectDispatchedEvent({
        dateTimeOccurred: getNow(),
        type: "UserSignedUp",
        payload: expectedUser,
      });

      // expectUserEmailNotToBeConfirmed(userEntity);
      // How to improve hashing process testing ?
      expectUserHashedPasswordExist(userEntity);
      expectUserToHaveAnAuthToken(userEntity);
    });
  });

  const signUp = async (params: Partial<SignUpParams>) => {
    const signUpParams = buildSignUpParams(params);
    return signUpUseCase(signUpParams).run();
  };

  const buildSignUpParams = (
    params: Partial<SignUpParams> = {},
  ): SignUpParams => {
    const randomSignUpParams = {
      uuid: generateUuid(),
      email: "joHn@mail.com",
      password: "Secret123",
      firstName: " john",
      lastName: "doe ",
    };
    return R.merge(randomSignUpParams, params);
  };

  const expectUserResultToEqual = (
    result: Result<CurrentUserWithAuthToken>,
    expectedUserDTO: CurrentUserWithAuthToken,
  ) => {
    expect(result.isRight()).toBe(true);
    expect(result.extract()).toEqual(expectedUserDTO);
  };

  // const expectUserEmailNotToBeConfirmed = (userEntity: UserEntity) =>
  //   expect(userEntity.getProps().isEmailConfirmed).toBe(false);

  const expectUserHashedPasswordExist = (userEntity: UserEntity) => {
    expect(userEntity.getProps().password.value.length).toBe(60);
  };

  const expectUserToHaveAnAuthToken = (userEntity: UserEntity) => {
    expect(userEntity.getProps().authToken).toBeTruthy();
  };
});
