import { generateUuid } from '@paralogs/shared';

import { AppEvent, EventBus } from './EventBus';

export type InMemoryEventBus = EventBus & { events: AppEvent[] };

type Subscriptions = {
  [eventType in AppEvent['type']]: {
    [id: string]: (params: any) => void;
  };
};

interface EventBusDependencies {
  getNow: () => Date;
}

export const createInMemoryEventBus = ({
  getNow,
}: EventBusDependencies): InMemoryEventBus => {
  const events: AppEvent[] = [];
  const subscriptions: Subscriptions = {
    UserSignedUp: {},
    UserUpdated: {},
  };

  return {
    subscribe: (eventType: AppEvent['type'], callback) => {
      const id = generateUuid();
      subscriptions[eventType][id] = callback;
      return {
        unsubscribe: () => {
          delete subscriptions[eventType][id];
        },
      };
    },
    publish: ({ type, payload }) => {
      events.push({
        dateTimeOccurred: getNow(),
        type,
        payload,
      } as AppEvent);
      Object.keys(subscriptions[type]).forEach((id) => {
        subscriptions[type][id](payload);
      });
    },
    events,
  };
};
