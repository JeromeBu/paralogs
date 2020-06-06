import * as Yup from "yup";

import { validationError } from "../errors";
import { validateSchema } from "./response-lib";

describe("Validate schema", () => {
  describe("when schema is not provided", () => {
    it("returns an explicit error", async () => {
      const yupSchema = Yup.object().shape({
        myKey: Yup.string().required(),
      });
      await expectValidationToBe(
        yupSchema,
        "",
        validationError("No body was provided"),
      );
    });
  });

  describe("when body does not match schema", () => {
    it("returns an explicit error", async () => {
      const yupSchema = Yup.object().shape({
        myRequiredKey: Yup.string().required(),
      });
      await expectValidationToBe(
        yupSchema,
        { fails: true },
        validationError("myRequiredKey is a required field"),
      );
    });
  });

  describe("when body matches schema", () => {
    it("returns the valid data", async () => {
      const yupSchema = Yup.object().shape({
        myRequiredKey: Yup.string().required(),
      });
      const body = { myRequiredKey: "some value" };
      await expectValidationToBe(yupSchema, body, body);
    });
  });

  const expectValidationToBe = async (
    schema: Yup.ObjectSchema<any>,
    body: any,
    expected: any,
  ) => {
    expect((await validateSchema(schema, body).run()).extract()).toMatchObject(
      expected,
    );
  };
});
