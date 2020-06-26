import {
  getCurrentUserReadCreator,
  loginRead,
  signUpCommandHandler,
  updateUserCommandHandler,
} from "@paralogs/auth/domain";
import {
  ProductionTokenManager,
  ProductionHasher,
} from "@paralogs/auth/secondary-adapters";
import { ENV } from "@paralogs/shared/back";
import { eventBus, queries, repositories } from "./secondaryAdaptersChoice";

const userRepo = repositories.user;
const userQueries = queries.user;
const tokenManager = new ProductionTokenManager(ENV.jwtSecret);
const hasher = new ProductionHasher();

export const authUseCases = {
  updateUser: updateUserCommandHandler({
    eventBus,
    userRepo,
  }),
  login: loginRead({
    userRepo,
    hasher,
  }),
  signUp: signUpCommandHandler({
    eventBus,
    userRepo,
    tokenManager,
    hasher,
  }),
  getMe: getCurrentUserReadCreator({
    userQueries,
  }),
};
