import { createClient } from "redis";
import { ENV } from "../config";

import { EventBus } from "./EventBus";

export const createRedisEventBus = (): EventBus => {
  const publisher = createClient(6379, ENV.redisHost);
  const subscriber = createClient(6379, ENV.redisHost);
  return {
    publish: ({ type, payload }) =>
      publisher.publish(type, JSON.stringify(payload)),
    subscribe: (eventType, callback) => {
      subscriber.on("message", (channel, message) => {
        if (channel === eventType) callback(JSON.parse(message));
      });
      subscriber.subscribe(eventType);

      return {
        unsubscribe: () => subscriber.unsubscribe(eventType),
      };
    },
  };
};
