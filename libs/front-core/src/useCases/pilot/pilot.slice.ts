import { StringError, ValueOf } from "@paralogs/shared";
import { PilotDTO } from "@paralogs/logbook/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PilotState = {
  error?: string;
  isUpdateFormVisible: boolean;
  isSaving: boolean;
  isLoading: boolean;
  data: PilotDTO | null;
};

const initialState: PilotState = {
  isUpdateFormVisible: false,
  isSaving: false,
  isLoading: false,
  data: null,
};

const setPilotInformation = (
  state: PilotState,
  payload: PilotDTO | null,
): PilotState => ({
  ...state,
  isSaving: false,
  data: payload,
});

const pilotSlice = createSlice({
  name: "pilot",
  initialState,
  reducers: {
    showUpdateForm: (state): PilotState => ({
      ...state,
      isUpdateFormVisible: true,
    }),
    hideUpdateForm: (state): PilotState => ({
      ...state,
      isUpdateFormVisible: false,
    }),

    retrievedCurrentPilotSucceeded: (state, action: PayloadAction<PilotDTO>) =>
      setPilotInformation(state, action.payload),

    pilotInformationSet: (
      state: PilotState,
      action: PayloadAction<PilotDTO | null>,
    ): PilotState => setPilotInformation(state, action.payload),

    retrievedCurrentPilotFailed: (
      state: PilotState,
      action: PayloadAction<StringError>,
    ): PilotState => ({
      ...state,
      isLoading: false,
      isSaving: false,
      error: action.payload,
    }),
  },
});

export const { actions: pilotActions, reducer: pilotReducer } = pilotSlice;
export type PilotAction = ReturnType<ValueOf<typeof pilotActions>>;
