/**
 * @group unit
 */

import { expectEitherToMatchError, expectRight } from "@paralogs/back-shared";
import { makeWingDTO } from "@paralogs/shared";

import { InMemoryWingRepo } from "../../../../adapters/secondaries/persistence/inMemory/InMemoryWingRepo";
import { wingMapper } from "../../mappers/wing.mapper";
import { makeWingEntity } from "../../testBuilders/makeWingEntity";
import {
  UpdateWingCommandHandler,
  updateWingCommandHandlerCreator,
} from "./UpdateWingCommandHandler";

describe("update wing use case", () => {
  let updateWingUseCase: UpdateWingCommandHandler;
  let wingRepo: InMemoryWingRepo; // cannot use WingRepo because need access .wings

  beforeEach(() => {
    wingRepo = new InMemoryWingRepo();
    updateWingUseCase = updateWingCommandHandlerCreator({ wingRepo });
  });

  describe("when no wing matches", () => {
    it("fails with explicit message", async () => {
      const response = await updateWingUseCase(makeWingDTO()).run();
      expectEitherToMatchError(response, "No such wing identity found");
    });
  });

  describe("All is good", () => {
    it("updates a wing", async () => {
      // the userUuid here is just a random uuid -> see in makeWingDTO.ts
      const wingDTO = makeWingDTO();
      const wingEntity = makeWingEntity(wingDTO);
      wingEntity.setIdentity(3);
      wingRepo.wings.push(wingEntity);
      const { uuid, pilotUuid } = wingDTO;
      const newParams = {
        uuid,
        pilotUuid,
        brand: "New Nova",
        model: "Ion 6",
        flightTimePriorToOwn: 60,
        ownerFrom: new Date("2020-03-01").toUTCString(),
      };
      const response = await updateWingUseCase(newParams).run();
      expectRight(response);

      const expectedWingDTO = makeWingDTO(newParams);
      const updatedWing = wingMapper.entityToDTO(wingRepo.wings[0]);
      expect(updatedWing).toEqual(expectedWingDTO);
    });
  });
});
