// eslint-disable-next-line
import { v4 as uuidV4 } from "uuid";

export const generateUuid = uuidV4;

export const isUuid = (str: string): boolean =>
  !!str.match(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  );

export interface UuidGenerator {
  generate: () => string;
}

export class FakeUuidGenerator implements UuidGenerator {
  private uuid: string;

  constructor(initialId: string) {
    this.uuid = initialId;
  }

  public generate() {
    return this.uuid;
  }

  public setUuid(id: string) {
    this.uuid = id;
  }
}

export class ActualUuidGenerator implements UuidGenerator {
  public generate() {
    return generateUuid();
  }
}
