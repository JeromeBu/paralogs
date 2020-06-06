import * as Yup from "yup";

import { DateString, Flavor, NumberOfMinutes } from "../generalTypes/types";
import { WithPilotUuid } from "./PilotDTOs";

export type WingUuid = Flavor<string, "WingUuid">;

export interface AddWingDTO {
  uuid: WingUuid;
  brand: string;
  model: string;
  ownerFrom: DateString;
  ownerUntil?: DateString;
  flightTimePriorToOwn: NumberOfMinutes;
}

export const addWingSchema = Yup.object().shape<AddWingDTO>({
  uuid: Yup.string().required(),
  brand: Yup.string().required(),
  model: Yup.string().required(),
  ownerFrom: Yup.string().required(),
  ownerUntil: Yup.string(),
  flightTimePriorToOwn: Yup.number(),
});

export type WingDTO = AddWingDTO & WithPilotUuid;

export interface UpdateWingDTO extends Partial<AddWingDTO> {
  uuid: WingUuid;
}

export const updateWingSchema = Yup.object().shape<UpdateWingDTO>({
  uuid: Yup.string().required(),
  brand: Yup.string(),
  model: Yup.string(),
  ownerFrom: Yup.string(),
  ownerUntil: Yup.string(),
  flightTimePriorToOwn: Yup.number(),
});
