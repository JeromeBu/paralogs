import { AppEvent, InMemoryEventBus } from "@paralogs/back-shared";

export const createExpectDispatchedEvent = (eventBus: InMemoryEventBus) => (
  event: AppEvent,
) => {
  expect(eventBus.events).toContainEqual(event);
};
