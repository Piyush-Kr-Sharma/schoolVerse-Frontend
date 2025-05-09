import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teachersList: [],
  teacherDetails: [],
  loading: false,
  error: null,
  response: null,
  mailStatus: null,
};

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    doneSuccess: (state, action) => {
      state.teacherDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getSuccess: (state, action) => {
      state.teachersList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    postDone: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    sendMail: (state) => {
      state.loading = true; // Set loading to true when sending mail
      state.mailStatus = null; // Reset mail status
      state.error = null;
    },
    sendMailSuccess: (state, action) => {
      state.loading = false;
      state.mailStatus = action.payload; // Update mail status with success message
      state.error = null;
    },
    sendMailFailed: (state, action) => {
      state.loading = false;
      state.mailStatus = null; // Reset mail status on failure
      state.error = action.payload; // Store the error message
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  doneSuccess,
  postDone,
  sendMail,
  sendMailSuccess,
  sendMailFailed,
} = teacherSlice.actions;

export const teacherReducer = teacherSlice.reducer;
