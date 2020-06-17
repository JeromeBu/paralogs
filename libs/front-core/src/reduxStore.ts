import { configureStore, getDefaultMiddleware, Store } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";

import { rootEpic } from "./store/root-epic";
import { rootReducer } from "./store/root-reducer";
import { Dependencies } from "./StoreDependencies";

export const configureReduxStore = (dependencies: Dependencies): Store => {
  const epicMiddleware = createEpicMiddleware({ dependencies });
  const token = dependencies.clientStorage.get("token");

  const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware({ thunk: false }), epicMiddleware],
    preloadedState: {
      auth: {
        isLoading: false,
        currentUser: null,
        token,
      },
    },
  });
  epicMiddleware.run(rootEpic);
  return store;
};
