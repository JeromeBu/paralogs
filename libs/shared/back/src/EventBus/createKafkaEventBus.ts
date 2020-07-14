import { generateUuid } from "@paralogs/shared/common";
import { Kafka } from "kafkajs";
import { EventBus } from "./EventBus";

const kafka = new Kafka({
  clientId: "paralogs",
  brokers: ["192.168.1.12:9092"],
});

export const createKafkaEventBus = async (): Promise<EventBus> => {
  const producer = kafka.producer();
  await producer.connect();

  return {
    publish: ({ type, payload }) => {
      producer.send({
        topic: type,
        messages: [{ value: JSON.stringify(payload) }],
      });
    },
    subscribe: async (eventType, callback) => {
      const consumer = kafka.consumer({ groupId: generateUuid() });
      await consumer.connect();
      await consumer.subscribe({
        topic: eventType,
        fromBeginning: false,
      });

      await consumer.run({
        eachMessage: async ({ message }) => {
          console.log({
            value: message.value.toString(),
          });
          callback(JSON.parse(message.value.toString()));
        },
      });

      return {
        unsubscribe: () => consumer.disconnect(),
      };
    },
  };
};
