import {
  checkNotExists,
  notUniqError,
  ResultAsync,
} from "@paralogs/shared/back";
import { FlightDTO } from "@paralogs/logbook/interfaces";
import { EitherAsync } from "purify-ts";

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
    .chain(() => EitherAsync.liftEither(FlightEntity.create(flightDto)))
    .chain((flightEntity) => flightRepo.save(flightEntity));
};

export type AddFlightCommandHandler = ReturnType<
  typeof addFlightCommandHandlerCreator
>;
