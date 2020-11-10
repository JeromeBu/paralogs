import { getNextId, ResultAsync, RightAsyncVoid } from "@paralogs/shared/back";
import { findByUuidAndReplace } from "@paralogs/shared/common";
import { PilotUuid, WingUuid } from "@paralogs/logbook/interfaces";
import { WingEntity } from "@paralogs/logbook/domain";
import { List, MaybeAsync } from "purify-ts";

import { WingRepo } from "../WingRepo";

export class InMemoryWingRepo implements WingRepo {
  private _wings: WingEntity[] = [];

  public findByUuid(wingUuid: WingUuid) {
    const maybeWingEntity = List.find(
      (wing) => wing.uuid === wingUuid,
      this.wings,
    );
    return MaybeAsync.liftMaybe(maybeWingEntity);
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
