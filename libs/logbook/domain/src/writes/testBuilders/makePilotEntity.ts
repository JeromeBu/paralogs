import { makePilotDTO, PilotDTO } from "@paralogs/logbook/interfaces";
import { InMemoryPilotRepo } from "@paralogs/logbook/domain";

import { PilotEntity } from "../entities/PilotEntity";

export const makePilotEntity = async (
  pilotParams: Partial<PilotDTO> & { pilotId?: number } = {},
): Promise<PilotEntity> => {
  const { pilotId } = pilotParams;
  const pilotDTO = makePilotDTO(pilotParams);
  return (
    await PilotEntity.create(pilotDTO).map((pilotEntity) => {
      if (pilotId) pilotEntity.setIdentity(pilotId);
      return pilotEntity;
    })
  )
    .ifLeft((error) => {
      throw error;
    })
    .extract() as PilotEntity;
};

interface SetupCurrentUserDependencies {
  pilotRepo: InMemoryPilotRepo;
}

export const setupCurrentPilotCreator = ({
  pilotRepo,
}: SetupCurrentUserDependencies) => async (userParams?: Partial<PilotDTO>) => {
  const currentUserEntity = await makePilotEntity(userParams);
  if (!currentUserEntity.hasIdentity()) currentUserEntity.setIdentity(125);
  pilotRepo.setPilots([currentUserEntity]);
  return currentUserEntity;
};

export type SetupCurrentUser = ReturnType<typeof setupCurrentPilotCreator>;
