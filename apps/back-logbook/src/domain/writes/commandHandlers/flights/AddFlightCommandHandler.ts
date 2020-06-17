import {
  checkNotExists,
  notUniqError,
  ResultAsync,
} from "@paralogs/back/shared";
import { FlightDTO } from "@paralogs/shared";
import { liftEither } from "purify-ts/EitherAsync";

import { FlightEntity } from "../../entities/FlightEntity";
import { FlightRepo } from "../../gateways/FlightRepo";

interface AddFlightDependencies {
  flightRepo: FlightRepo;
}

export const addFlightCommandHandlerCreator = ({
  flightRepo,
}: AddFlightDependencies) => (flightDto: FlightDTO): ResultAsync<void> => {
  const maybeAsyncFlightEntity = flightRepo.findByUuid(flightDto.uuid);
  return checkNotExists(
    maybeAsyncFlightEntity,
    notUniqError("A flight with this id already exists"),
  )
    .chain(() => liftEither(FlightEntity.create(flightDto)))
    .chain((flightEntity) => flightRepo.save(flightEntity));
};

export type AddFlightCommandHandler = ReturnType<
  typeof addFlightCommandHandlerCreator
>;
