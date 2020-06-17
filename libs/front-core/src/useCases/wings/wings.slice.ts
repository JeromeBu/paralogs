import { findByUuidAndReplace, StringError, ValueOf } from "@paralogs/shared";
import {
  AddWingDTO,
  UpdateWingDTO,
  WingDTO,
} from "@paralogs/logbook/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type WingsState = Readonly<{
  isAddWingFormVisible: boolean;
  data: WingDTO[];
  isSaving: boolean;
  isLoading: boolean;
  error?: StringError;
}>;

const initialState: WingsState = {
  isAddWingFormVisible: false,
  data: [],
  isSaving: false,
  isLoading: false,
};

const setError = (
  state: WingsState,
  action: PayloadAction<StringError>,
): WingsState => ({
  ...state,
  isLoading: false,
  isSaving: false,
  error: action.payload,
});

const wingsSlice = createSlice({
  name: "wings",
  initialState,
  reducers: {
    showAddWingForm: (state) => ({ ...state, isAddWingFormVisible: true }),
    hideAddWingForm: (state) => ({ ...state, isAddWingFormVisible: false }),

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addWingRequested: (state, action: PayloadAction<AddWingDTO>) => ({
      ...state,
      isSaving: true,
    }),
    addWingSucceeded: (state, action: PayloadAction<WingDTO>) => ({
      ...state,
      data: [action.payload, ...state.data],
      isSaving: false,
    }),
    addWingFailed: setError,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateWingRequested: (state, action: PayloadAction<UpdateWingDTO>) => ({
      ...state,
      isSaving: true,
    }),
    updateWingSucceeded: (state, action: PayloadAction<WingDTO>) => ({
      ...state,
      isSaving: false,
      data: findByUuidAndReplace(state.data, action.payload),
    }),
    updateWingFailed: setError,

    retrieveWingsRequested: (state) => ({ ...state, isLoading: true }),
    retrieveWingsSucceeded: (state, action: PayloadAction<WingDTO[]>) => ({
      ...state,
      data: action.payload,
      isLoading: false,
    }),
    retrieveWingsError: setError,
    retrieveWingsFailed: setError,
  },
});

export const { actions: wingActions, reducer: wingsReducer } = wingsSlice;
export type WingAction = ReturnType<ValueOf<typeof wingActions>>;
