import { callUseCase, EventBus, RightAsync } from "@paralogs/shared/back";
import { PilotUuid } from "@paralogs/logbook/interfaces";

import { pilotsUseCases } from "../config/useCasesChoice";

export const subscribeToEvents = async (eventBus: EventBus) => {
  eventBus.subscribe("UserSignedUp", async (userDTO) => {
    await callUseCase({
      useCase: await pilotsUseCases.create,
      eitherAsyncParams: RightAsync({
        ...userDTO,
        uuid: userDTO.uuid as PilotUuid,
      }),
    });
  });
  eventBus.subscribe("UserUpdated", async (userDTO) => {
    await callUseCase({
      useCase: await pilotsUseCases.update,
      eitherAsyncParams: RightAsync({
        ...userDTO,
        uuid: userDTO.uuid as PilotUuid,
      }),
    });
  });
};
