import { CreateInMemoryEventBus } from "./createInMemoryEventBus";
import { AppEvent } from "./EventBus";

export const createExpectDispatchedEvent = (
  eventBus: CreateInMemoryEventBus,
) => (event: AppEvent) => {
  expect(eventBus.events).toContainEqual(event);
};
