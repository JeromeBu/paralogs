import { RootState } from "@paralogs/front-core";

export const authSelectors = {
  isAuthenticated: (state: RootState) => state.auth.token !== null,
  error: (state: RootState) => state.auth.error,
  currentUser: (state: RootState) => state.auth.currentUser,
  isUpdateFormVisible: (state: RootState) => state.auth.isUpdateFormVisible,
};
