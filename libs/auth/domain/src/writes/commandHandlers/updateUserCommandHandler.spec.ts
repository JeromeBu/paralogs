/**
 * @group unit
 */

import {
  createInMemoryEventBus,
  InMemoryEventBus,
} from "@paralogs/shared/back";
import {
  createExpectDispatchedEvent,
  expectRight,
} from "@paralogs/shared/back-test-helpers";
import { Hasher } from "../gateways/Hasher";

import {
  InMemoryUserRepo,
  TestTokenManager,
} from "../gateways/testImplementations";
import { UserEntity } from "../entities/UserEntity";
import { TestHasher } from "../gateways/testImplementations/TestHasher";
import { TokenManager } from "../gateways/TokenManager";
import { userMapper } from "../mappers/user.mapper";
import { setupCurrentUserCreator } from "../testBuilders/makeUserEntityCreator";
import { updateUserCommandHandler } from "./updateUserCommandHandler";

describe("Update user", () => {
  describe("all is good", () => {
    const now = new Date("2020-02-01");
    let userRepo: InMemoryUserRepo;
    let currentUser: UserEntity;
    let updateUser: ReturnType<typeof updateUserCommandHandler>;
    let tokenManager: TokenManager;
    let hasher: Hasher;
    let eventBus: InMemoryEventBus;
    let expectDispatchedEvent: ReturnType<typeof createExpectDispatchedEvent>;

    beforeEach(async () => {
      userRepo = new InMemoryUserRepo();
      tokenManager = new TestTokenManager();
      hasher = new TestHasher();
      eventBus = createInMemoryEventBus({
        getNow: () => now,
      });
      expectDispatchedEvent = createExpectDispatchedEvent(eventBus);
      currentUser = await setupCurrentUserCreator({
        userRepo,
        tokenManager,
        hasher,
      })();
      updateUser = updateUserCommandHandler({
        userRepo,
        eventBus,
      });
    });

    it("updates user's data", async () => {
      const newFirstName = "Changedfirstname";
      const newLastName = "ChangedLastName";
      const result = await updateUser({
        uuid: currentUser.uuid,
        firstName: newFirstName,
        lastName: newLastName,
      }).run();

      expectRight(result);

      const { uuid } = currentUser;

      const updatedCurrentUser = userRepo.users.find(
        (user) => user.uuid === uuid,
      )!;

      expect(updatedCurrentUser).toBeTruthy();

      const expectedUserDto = {
        uuid,
        email: currentUser.email.value,
        firstName: newFirstName,
        lastName: newLastName,
      };

      expect(userMapper.entityToDTO(updatedCurrentUser)).toMatchObject(
        expectedUserDto,
      );

      expectDispatchedEvent({
        dateTimeOccurred: now,
        type: "UserUpdated",
        payload: expectedUserDto,
      });
    });
  });
});
