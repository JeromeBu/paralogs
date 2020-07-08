/**
 * @group unit
 */

import { CurrentUserWithAuthToken } from "@paralogs/auth/interface";
import { JustAsync } from "@paralogs/shared/back";
import { generateUuid } from "@paralogs/shared/common";

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
        JustAsync({ token: "someAuthToken", currentUser: userDto }),
    };

    const getCurrentUserRead = getCurrentUserReadCreator({ userQueries });

    const userDtoWithToken = (
      await getCurrentUserRead({ userUuid }).run()
    ).extract() as CurrentUserWithAuthToken;
    expect(userDtoWithToken.currentUser).toEqual(userDto);
    expect(userDtoWithToken.token).toBeTruthy();
  });
});
