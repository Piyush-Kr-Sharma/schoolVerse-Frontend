import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignments: [], // Stores assignments fetched for a teacher or student
  submissions: [], // Stores submissions fetched for a specific assignment
  loading: false,
  error: null,
  response: null,
  statestatus: "idle",
  uploadStatus: null,
  totalAssignments: 0,
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.response = null;
      state.uploadStatus = null;
    },
    getAssignmentsSuccess: (state, action) => {
      state.assignments = action.payload;
      state.loading = false;
      state.error = null;
    },
    postAssignmentSuccess: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    uploadFileSuccess: (state) => {
      state.uploadStatus = "success";
      state.loading = false;
      state.error = null;
    },
    uploadFileFailure: (state, action) => {
      state.uploadStatus = "failed";
      state.error = action.payload;
      state.loading = false;
    },
    submitAssignmentSuccess: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    uploadAssignmentSuccess: (state) => {
      state.uploadStatus = "success";
      state.loading = false;
      state.error = null;
    },
    uploadAssignmentFailure: (state, action) => {
      state.uploadStatus = "failed";
      state.error = action.payload;
      state.loading = false;
    },
    getFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
    },
    getError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetAssignmentState: (state) => {
      state.assignments = [];
      state.loading = false;
      state.error = null;
      state.response = null;
      state.statestatus = "idle";
      state.uploadStatus = null; // Reset upload status
    },
    getTotalAssignments: (state, action) => {
      state.totalAssignments = action.payload;
      state.loading = false;
      state.error = null;
    },
    getSubmissionsSuccess: (state, action) => {
      state.submissions = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  getRequest,
  getAssignmentsSuccess,
  postAssignmentSuccess,
  uploadFileSuccess,
  uploadFileFailure,
  getFailed,
  getError,
  resetAssignmentState,
  getTotalAssignments,
  submitAssignmentSuccess,
  uploadAssignmentSuccess,
  uploadAssignmentFailure,
  getSubmissionsSuccess,
} = assignmentSlice.actions;

export const assignmentReducer = assignmentSlice.reducer;
