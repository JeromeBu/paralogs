import { UserDTO } from "@paralogs/auth/interface";

interface Event<K extends string, P> {
  dateTimeOccurred: Date;
  type: K;
  payload: P;
}

export type AppEvent =
  | Event<"UserSignedUp", UserDTO>
  | Event<"UserUpdated", UserDTO>;

type NarrowEvent<
  T extends AppEvent["type"],
  E extends AppEvent = AppEvent
> = Extract<E, { type: T }>;

export interface EventBus {
  subscribe: <T extends AppEvent["type"]>(
    eventType: T,
    callback: (payload: NarrowEvent<T>["payload"]) => void,
  ) => { unsubscribe: () => void } | Promise<{ unsubscribe: () => void }>;
  publish: (eventParams: Omit<AppEvent, "dateTimeOccurred">) => void;
}
