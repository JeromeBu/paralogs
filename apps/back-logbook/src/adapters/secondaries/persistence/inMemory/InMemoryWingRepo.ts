import { getNextId, ResultAsync, RightAsyncVoid } from "@paralogs/back-shared";
import { findByUuidAndReplace, PilotUuid, WingUuid } from "@paralogs/shared";
import { List } from "purify-ts";
import { liftMaybe } from "purify-ts/MaybeAsync";

import { WingEntity } from "../../../../domain/writes/entities/WingEntity";
import { WingRepo } from "../../../../domain/writes/gateways/WingRepo";

export class InMemoryWingRepo implements WingRepo {
  private _wings: WingEntity[] = [];

  public findByUuid(wingUuid: WingUuid) {
    const maybeWingEntity = List.find(
      (wing) => wing.uuid === wingUuid,
      this.wings,
    );
    return liftMaybe(maybeWingEntity);
  }

  public async findByPilotUuid(pilotUuid: PilotUuid) {
    return this._wings.filter((wing) => pilotUuid === wing.pilotUuid);
  }

  public save(wingEntity: WingEntity): ResultAsync<void> {
    return wingEntity.hasIdentity()
      ? this._update(wingEntity)
      : this._create(wingEntity);
  }

  get wings() {
    return this._wings;
  }

  private _update(wingEntity: WingEntity): ResultAsync<void> {
    this._wings = findByUuidAndReplace(this._wings, wingEntity);
    return RightAsyncVoid();
  }

  private _create(wingEntity: WingEntity): ResultAsync<void> {
    wingEntity.setIdentity(getNextId(this._wings));
    this._wings = [wingEntity, ...this._wings];
    return RightAsyncVoid();
  }
}
