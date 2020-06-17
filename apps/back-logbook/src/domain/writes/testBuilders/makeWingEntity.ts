import { makeWingDTO, WingDTO } from "@paralogs/logbook/interfaces";

import { WingEntity } from "../entities/WingEntity";

export const makeWingEntity = (wingParams?: Partial<WingDTO>): WingEntity => {
  const wingDto = makeWingDTO(wingParams);
  return WingEntity.create(wingDto)
    .ifLeft((error) => {
      throw error;
    })
    .extract() as WingEntity;
};
