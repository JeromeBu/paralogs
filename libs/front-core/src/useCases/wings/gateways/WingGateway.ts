import {
  AddWingDTO,
  UpdateWingDTO,
  WingDTO,
} from "@paralogs/logbook/interfaces";
import { Observable } from "rxjs";

export interface WingGateway {
  retrieveWings(): Observable<WingDTO[]>;
  addWing(wing: AddWingDTO): Observable<WingDTO>;
  updateWing(updateParams: UpdateWingDTO): Observable<WingDTO>;
  /* QUESTION: return null, void or WingDTO ? */
}
