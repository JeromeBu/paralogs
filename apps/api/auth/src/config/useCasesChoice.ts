import {
  getCurrentUserReadCreator,
  loginReadCreator,
  signUpCommandHandler,
  updateUserCommandHandler,
} from "@paralogs/auth/domain";
import { ProductionHashAndTokenManager } from "@paralogs/auth/secondary-adapters";
import { ENV } from "@paralogs/shared/back";
import { ActualUuidGenerator } from "@paralogs/shared/common";
import { eventBus, queries, repositories } from "./secondaryAdaptersChoice";

const userRepo = repositories.user;
const userQueries = queries.user;
const hashAndTokenManager = new ProductionHashAndTokenManager(ENV.jwtSecret);
const uuidGenerator = new ActualUuidGenerator();

export const authUseCases = {
  updateUser: updateUserCommandHandler({
    eventBus,
    userRepo,
  }),
  login: loginReadCreator({
    userRepo,
    hashAndTokenManager,
  }),
  signUp: signUpCommandHandler({
    eventBus,
    userRepo,
    hashAndTokenManager,
    uuidGenerator,
  }),
  getMe: getCurrentUserReadCreator({
    userQueries,
  }),
};
