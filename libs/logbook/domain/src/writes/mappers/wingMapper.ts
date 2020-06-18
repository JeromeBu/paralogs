import { WingDTO } from "@paralogs/logbook/interfaces";

import { WingEntity } from "../entities/WingEntity";

export const wingMapper = {
  entityToDTO: (wingEntity: WingEntity): WingDTO => {
    return wingEntity.getProps();
  },
};
