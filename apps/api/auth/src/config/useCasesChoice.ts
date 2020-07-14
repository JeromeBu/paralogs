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
import {
  getEventBus,
  getRepositoriesAndQueries,
} from "./secondaryAdaptersChoice";

const tokenManager = new ProductionTokenManager(ENV.jwtSecret);
const hasher = new ProductionHasher();

export const getAuthUseCases = async () => {
  const { repositories, queries } = await getRepositoriesAndQueries();
  const userRepo = repositories.user;
  const userQueries = queries.user;
  const eventBus = await getEventBus();

  return {
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
};
