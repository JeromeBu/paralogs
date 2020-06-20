import { makeAppErrorCreator } from "@paralogs/shared/back";

export const knexError = makeAppErrorCreator({
  code: 501,
  name: "Knex error",
});
