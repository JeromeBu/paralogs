import { AddWingDTO, UpdateWingDTO, WingDTO } from "@paralogs/shared";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

import { WingGateway } from "../useCases/wings/gateways/WingGateway";

export class InMemoryWingGateway implements WingGateway {
  private _wings$ = new BehaviorSubject<WingDTO[]>([]);

  public retrieveWings() {
    return this._wings$;
  }

  public addWing(addWingDto: AddWingDTO) {
    return this._wings$.pipe(
      map((wings) => wings.find(({ uuid }) => uuid === addWingDto.uuid)!),
    );
  }

  public updateWing(updateWingDTO: UpdateWingDTO) {
    return this._wings$.pipe(
      map((wings) => wings.find(({ uuid }) => uuid === updateWingDTO.uuid)!),
    );
  }

  get wings$() {
    return this._wings$;
  }
}
