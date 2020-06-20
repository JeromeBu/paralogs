/**
 * @group unit
 */

import { expectRight } from "@paralogs/shared/back-test-helpers";
import { List } from "purify-ts";

import { InMemoryPilotRepo } from "../../gateways/testImplementations/InMemoryPilotRepo";
import { PilotEntity } from "../../entities/PilotEntity";
import { pilotMapper } from "../../mappers/pilotMapper";
import { setupCurrentPilotCreator } from "../../testBuilders/makePilotEntity";
import {
  UpdatePilotCommandHandler,
  updatePilotCommandHandlerCreator,
} from "./UpdatePilotCommandHandler";

describe("Update pilot", () => {
  describe("all is good", () => {
    let pilotRepo: InMemoryPilotRepo;
    let currentPilot: PilotEntity;
    let updatePilotUseCase: UpdatePilotCommandHandler;

    beforeEach(async () => {
      pilotRepo = new InMemoryPilotRepo();
      currentPilot = await setupCurrentPilotCreator({ pilotRepo })();
      updatePilotUseCase = updatePilotCommandHandlerCreator({ pilotRepo });
    });

    it("updates pilot's data", async () => {
      const newFirstName = "Changedfirstname";
      const newLastName = "ChangedLastName";
      const result = await updatePilotUseCase({
        uuid: currentPilot.uuid,
        firstName: newFirstName,
        lastName: newLastName,
      }).run();

      expectRight(result);

      const { uuid } = currentPilot;

      const updatedCurrentUser = List.find(
        (pilot) => pilot.uuid === uuid,
        pilotRepo.pilots,
      );
      updatedCurrentUser.ifNothing(() => {
        expect("no user was found").toBe(false);
      });
      expect(
        pilotMapper.entityToDTO(updatedCurrentUser.extract() as PilotEntity),
      ).toMatchObject({
        uuid,
        firstName: newFirstName,
        lastName: newLastName,
      });
    });
  });
});
