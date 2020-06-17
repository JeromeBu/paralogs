import { StringError, ValueOf } from "@paralogs/shared";
import {
  CurrentUserWithAuthToken,
  LoginParams,
  SignUpParams,
  UpdateUserDTO,
  UserDTO,
} from "@paralogs/auth/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = Readonly<{
  error?: StringError;
  isLoading: boolean;
  isSaving: boolean;
  currentUser: UserDTO | null;
  token: string | null;
  isUpdateFormVisible: boolean;
}>;

const initialState: AuthState = {
  isLoading: false,
  isSaving: false,
  currentUser: null,
  token: null,
  isUpdateFormVisible: false,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const startLoading = <P>() => (state: AuthState, action: PayloadAction<P>) => ({
  ...state,
  isLoading: true,
});

const setError = (state: AuthState, action: PayloadAction<StringError>) => ({
  ...state,
  error: action.payload,
  isLoading: false,
  token: null,
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutRequested: startLoading<void>(),
    logoutSucceeded: (state) => ({
      ...state,
      isLoading: false,
      currentUser: null,
      token: null,
    }),

    getMeRequested: startLoading<void>(),
    getMeFailed: setError,

    signUpRequested: startLoading<SignUpParams>(),
    signUpFailed: setError,

    loginRequested: startLoading<LoginParams>(),
    loginFailed: setError,

    authenticationSucceeded: (
      state,
      action: PayloadAction<CurrentUserWithAuthToken>,
    ) => ({
      ...state,
      isLoading: false,
      error: undefined,
      currentUser: action.payload.currentUser,
      token: action.payload.token,
    }),

    updateUserRequested: (
      state: AuthState,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action: PayloadAction<UpdateUserDTO>,
    ) => ({
      ...state,
      isSaving: true,
    }),
    updateUserSucceeded: (
      state: AuthState,
      action: PayloadAction<UserDTO>,
    ) => ({
      ...state,
      currentUser: action.payload,
      isSaving: false,
    }),
    showUpdateForm: (state: AuthState) => ({
      ...state,
      isUpdateFormVisible: true,
    }),
    hideUpdateForm: (state: AuthState) => ({
      ...state,
      isUpdateFormVisible: false,
    }),
  },
});

export const { actions: authActions, reducer: authReducer } = authSlice;

export type AuthAction = ReturnType<ValueOf<typeof authActions>>;
