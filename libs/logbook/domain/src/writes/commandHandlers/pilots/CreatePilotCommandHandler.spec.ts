/**
 * @group unit
 */

import { expectRight } from "@paralogs/shared/back-test-helpers";
import { generateUuid } from "@paralogs/shared/common";

import { InMemoryPilotRepo } from "../../gateways/testImplementations";
import { pilotMapper } from "../../mappers/pilotMapper";
import { createPilotCommandHandlerCreator } from "./CreatePilotCommandHandler";

describe("Create pilot command", () => {
  describe("when all is good", () => {
    it("creates a user", async () => {
      const pilotRepo = new InMemoryPilotRepo();
      const createPilotCommandHandler = createPilotCommandHandlerCreator({
        pilotRepo,
      });
      const pilotDto = {
        uuid: generateUuid(),
        firstName: "John",
        lastName: "Doe",
      };
      const result = await createPilotCommandHandler(pilotDto).run();

      expectRight(result);
      expect(pilotMapper.entityToDTO(pilotRepo.pilots[0])).toEqual(pilotDto);
    });
  });
});
