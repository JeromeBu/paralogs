import { makeAppErrorCreator } from "@paralogs/back/shared";

export const knexError = makeAppErrorCreator({
  code: 501,
  name: "Knex error",
});
