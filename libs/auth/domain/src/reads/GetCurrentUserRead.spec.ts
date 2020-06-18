/**
 * @group unit
 */

import { CurrentUserWithAuthToken } from "@paralogs/auth/interface";
import { generateUuid } from "@paralogs/shared";
import { Just } from "purify-ts";
import { liftMaybe } from "purify-ts/MaybeAsync";

import { UserQueries } from "./gateways/UserQueries";
import { getCurrentUserReadCreator } from "./GetCurrentUserRead";

describe("Get Me, recovers logged user information", () => {
  it("get's users information", async () => {
    const userUuid = generateUuid();

    const userDto = {
      uuid: userUuid,
      email: "john@mail.com",
      firstName: "John",
      lastName: "Doe",
    };

    const userQueries: UserQueries = {
      findByUuidWithToken: () =>
        liftMaybe(Just({ token: "someAuthToken", currentUser: userDto })),
    };

    const getCurrentUserRead = getCurrentUserReadCreator({ userQueries });

    const userDtoWithToken = (
      await getCurrentUserRead({ userUuid }).run()
    ).extract() as CurrentUserWithAuthToken;
    expect(userDtoWithToken.currentUser).toEqual(userDto);
    expect(userDtoWithToken.token).toBeTruthy();
  });
});
