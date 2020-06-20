export class AppError extends Error {
  public code: number;
  public name: string;

  constructor(params: { code: number; name: string; message: string }) {
    super(params.message);
    this.name = params.name;
    this.code = params.code;
  }
}

export const makeAppErrorCreator = (params: { code: number; name: string }) => (
  message: string,
) =>
  new AppError({
    ...params,
    message,
  });

export const notUniqError = makeAppErrorCreator({
  code: 400,
  name: "Not Uniq error",
});

export const validationError = makeAppErrorCreator({
  code: 400,
  name: "Validation error",
});

export const forbiddenError = makeAppErrorCreator({
  code: 403,
  name: "Forbidden",
});

export const notFoundError = makeAppErrorCreator({
  code: 404,
  name: "Not found",
});

export const knexError = makeAppErrorCreator({
  code: 501,
  name: "Knex error",
});
