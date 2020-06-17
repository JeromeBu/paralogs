import { PilotDTO } from "@paralogs/logbook/interfaces";

import { PilotEntity } from "../entities/PilotEntity";

export const pilotMapper = {
  entityToDTO: (pilotEntity: PilotEntity): PilotDTO => {
    const { uuid, firstName, lastName } = pilotEntity.getProps();

    return {
      uuid,
      firstName: firstName.value,
      ...(lastName ? { lastName: lastName.value } : {}),
    };
  },
};
