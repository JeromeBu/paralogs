import { WingDTO } from "@paralogs/shared";

import { WingEntity } from "../entities/WingEntity";

export const wingMapper = {
  entityToDTO: (wingEntity: WingEntity): WingDTO => {
    return wingEntity.getProps();
  },
};
