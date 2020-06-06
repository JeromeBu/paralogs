import { InMemoryEventBus } from './createInMemoryEventBus';
import { AppEvent } from './EventBus';

export const createExpectDispatchedEvent = (eventBus: InMemoryEventBus) => (
  event: AppEvent
) => {
  expect(eventBus.events).toContainEqual(event);
};
