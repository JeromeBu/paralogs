/**
 * @group unit
 */

import { AppError, Result } from "@paralogs/back/shared";
import { generateUuid } from "@paralogs/shared";
import { makeWingDTO, WingDTO } from "@paralogs/logbook/interfaces";

import { InMemoryWingRepo } from "../../gateways/testImplementations/InMemoryWingRepo";
import {
  AddWingCommandHandler,
  addWingCommandHandlerCreator,
} from "./AddWingCommandHandler";

describe("wing creation", () => {
  let addWingUseCase: AddWingCommandHandler;
  let wingRepo: InMemoryWingRepo; // cannot use WingRepo because need access .wings

  beforeEach(() => {
    wingRepo = new InMemoryWingRepo();
    addWingUseCase = addWingCommandHandlerCreator({ wingRepo });
  });

  describe("a wing already exists with the same identity", () => {
    it("cannot create a wing with the same id", async () => {
      const uuid = generateUuid();
      const userUuid = generateUuid();
      const wingDto = makeWingDTO({ uuid });
      await addWingUseCase(wingDto).run();

      const secondWingDto = makeWingDTO({
        uuid,
        pilotUuid: userUuid,
        model: "LALALA",
      });
      expect(
        ((await addWingUseCase(secondWingDto).run()).extract() as AppError)
          .message,
      ).toMatch("Cannot create wing. A wing with this uuid already exists");
    });
  });

  describe("all is good", () => {
    it("creates a wing", async () => {
      const wingDto = makeWingDTO();
      const resultWingEntity = await addWingUseCase(wingDto).run();
      expect(wingRepo.wings[0].uuid).toBe(wingDto.uuid);
      expectWingDtoResultToEqual(resultWingEntity, wingDto);
    });
  });

  const expectWingDtoResultToEqual = (
    result: Result<WingDTO>,
    expected: WingDTO,
  ) => {
    const createdWingDTO = result.extract();
    expect(createdWingDTO).toEqual(expected);
  };
});
