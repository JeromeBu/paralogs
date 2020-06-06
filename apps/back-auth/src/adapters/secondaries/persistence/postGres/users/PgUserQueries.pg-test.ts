import { CurrentUserWithAuthToken, UserDTO } from "@paralogs/shared";

import { createAndPersistUser } from "../createAndPersistUser";
import { getKnex, resetDb } from "../knex/db";
import { createPgUserQueries } from "./PgUserQueries";

describe("Pg user reads", () => {
  const knex = getKnex("test");
  let pgUserQueries: ReturnType<typeof createPgUserQueries>;
  const johnEmail = "john@mail.com";
  let johnDto: UserDTO;

  beforeEach(async () => {
    await resetDb(knex);
    johnDto = await createAndPersistUser(knex, {
      id: 125,
      email: johnEmail,
    });
    pgUserQueries = createPgUserQueries(knex);
  });

  afterAll(() => knex.destroy());

  it("returns maybe none when not found", async () => {
    const foundUser = await pgUserQueries
      .findByUuidWithToken("not found id")
      .run();
    expect(foundUser.extract()).toBeUndefined();
  });

  it("finds a user from its id", async () => {
    const foundUser = (
      await pgUserQueries.findByUuidWithToken(johnDto.uuid).run()
    ).extract()! as CurrentUserWithAuthToken;
    expect(foundUser.currentUser).toEqual(johnDto);
    expect(foundUser.token).toBeDefined();
  });
});
