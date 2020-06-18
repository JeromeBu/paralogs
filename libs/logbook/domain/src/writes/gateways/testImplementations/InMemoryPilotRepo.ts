import {
  getNextId,
  LeftAsync,
  notFoundError,
  ResultAsync,
  RightAsyncVoid,
} from "@paralogs/back/shared";
import { findByUuidAndReplace } from "@paralogs/shared";
import { PilotUuid } from "@paralogs/logbook/interfaces";
import { PilotEntity } from "@paralogs/logbook/domain";
import { List } from "purify-ts";
import { liftMaybe } from "purify-ts/MaybeAsync";

import { PilotRepo } from "../PilotRepo";

export class InMemoryPilotRepo implements PilotRepo {
  private _pilots: PilotEntity[] = [];

  public save(pilotEntity: PilotEntity): ResultAsync<void> {
    if (pilotEntity.hasIdentity()) return this._update(pilotEntity);
    return this._create(pilotEntity);
  }

  public findByUuid(pilotUuid: PilotUuid) {
    return liftMaybe(
      List.find((pilotEntity) => pilotEntity.uuid === pilotUuid, this._pilots),
    );
  }

  get pilots() {
    return this._pilots;
  }

  public setPilots(pilots: PilotEntity[]) {
    this._pilots.splice(0, pilots.length, ...pilots);
  }

  private _create(pilotEntity: PilotEntity): ResultAsync<void> {
    pilotEntity.setIdentity(getNextId(this._pilots));
    this._pilots.push(pilotEntity);
    return RightAsyncVoid();
  }

  private _update(pilotEntity: PilotEntity): ResultAsync<void> {
    const newPilots = findByUuidAndReplace(this._pilots, pilotEntity);
    if (this._pilots === newPilots)
      return LeftAsync(notFoundError("No pilot found with this id"));
    this._pilots = newPilots;
    return RightAsyncVoid();
  }
}
