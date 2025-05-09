import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feeDetails: [], // Stores fee details of students
  loading: false,
  error: null,
  response: null,
  status: "idle", // Renamed from "statestatus" for clarity
  totalCollections: 0,
};

const feeSlice = createSlice({
  name: "fee",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.response = null;
      state.status = "loading";
    },
    getFeeDetailsSuccess: (state, action) => {
      state.feeDetails = action.payload;
      state.loading = false;
      state.status = "success";
    },
    updateFeeSuccess: (state, action) => {
      state.loading = false;
      state.response = action.payload || "Fee updated successfully!";
      state.status = "success";
    },
    getFailed: (state, action) => {
      state.loading = false;
      state.response = action.payload;
      state.status = "failed";
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "error";
    },
    resetFeeStatus: (state) => {
      state.loading = false;
      state.response = null;
      state.error = null;
      state.status = "idle";
    },
    setTotalFeeCollections: (state, action) => {
      state.totalCollections = action.payload;
    },
  },
});

export const {
  getRequest,
  getFeeDetailsSuccess,
  updateFeeSuccess,
  getFailed,
  getError,
  resetFeeStatus,
  setTotalFeeCollections,
} = feeSlice.actions;

export const feeReducer = feeSlice.reducer;
