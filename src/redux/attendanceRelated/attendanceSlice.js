import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  attendanceList: [], // Stores the attendance records
  loading: false,
  error: null,
  response: null,
  percentage: null, // Attendance percentage for a student
  statestatus: "idle",
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.response = null;
    },
    getSuccess: (state, action) => {
      state.attendanceList = action.payload;
      state.loading = false;
      state.error = null;
    },
    markAttendanceSuccess: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getPercentageSuccess: (state, action) => {
      state.percentage = parseFloat(action.payload);
      state.loading = false;
      state.error = null;
    },
    getFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
    },
    getError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetAttendanceState: (state) => {
      state.attendanceList = [];
      state.loading = false;
      state.error = null;
      state.response = null;
      state.percentage = null;
      state.statestatus = "idle";
    },
  },
});

export const {
  getRequest,
  getSuccess,
  markAttendanceSuccess,
  getPercentageSuccess,
  getFailed,
  getError,
  resetAttendanceState,
} = attendanceSlice.actions;

export const attendanceReducer = attendanceSlice.reducer;
