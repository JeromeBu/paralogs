import { AppEvent, InMemoryEventBus } from "@paralogs/shared/back";

export const createExpectDispatchedEvent = (eventBus: InMemoryEventBus) => (
  event: AppEvent,
) => {
  expect(eventBus.events).toContainEqual(event);
};
