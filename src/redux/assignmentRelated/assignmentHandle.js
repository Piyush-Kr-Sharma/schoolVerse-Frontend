import axios from "axios";
import {
  getRequest,
  getAssignmentsSuccess,
  postAssignmentSuccess,
  getFailed,
  getError,
  uploadFileSuccess,
  uploadFileFailure,
  getTotalAssignments,
  uploadAssignmentSuccess,
  uploadAssignmentFailure,
  submitAssignmentSuccess,
  getSubmissionsSuccess,
} from "./assignmentSlice";

// 1. POST assignment by the teacher
export const postAssignment = (assignmentData) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/Teacher/assignment`,
      assignmentData,
      { headers: { "Content-Type": "application/json" } }
    );

    if (result.data?.message) {
      dispatch(postAssignmentSuccess(result.data.message));
    } else {
      dispatch(getFailed("Failed to post the assignment"));
    }
  } catch (error) {
    dispatch(getError(error.message || "Error posting the assignment"));
  }
};

// Upload file for assignment
export const uploadFile = (file) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const formData = new FormData();
    formData.append("assignmentFile", file);

    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/Teacher/uploadFile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // console.log("file URL of the result: ", result.data?.fileURL);

    if (result.data?.fileURL) {
      dispatch(uploadFileSuccess(result.data));
      return result.data;
    } else {
      dispatch(uploadFileFailure("Failed to upload the file"));
      return null;
    }
  } catch (error) {
    dispatch(uploadFileFailure(error.message || "Error uploading the file"));
    return null;
  }
};

// Get Assignments for a student by subject
export const getAssignments = (studentId, subjectId) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Student/assignments/${studentId}/${subjectId}`
    );

    // console.log("result: ", result.data.assignments);
    if (result.data) {
      dispatch(getAssignmentsSuccess(result.data.assignments));
    } else {
      dispatch(getFailed("No assignments found for this subject"));
    }
  } catch (error) {
    dispatch(getError(error.message || "Error fetching assignments"));
  }
};

export const getAllAssignments = (studentId) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Student/getallassignment/${studentId}`
    );
    if (result.data?.totalAssignments) {
      dispatch(getTotalAssignments(result.data.totalAssignments));
    } else {
      dispatch(getFailed("No assignments found!!"));
    }
  } catch (error) {
    dispatch(getError(error.message || "Error fetching assignments"));
  }
};

export const uploadAssignment = (file) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const formData = new FormData();
    formData.append("submitAssignmentFile", file);

    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/Student/uploadFile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // console.log("result from upload ass: ", result);

    // console.log("file URL of the result: ", result.data?.file);

    if (result.data?.file) {
      dispatch(uploadAssignmentSuccess(result.data));
      return result.data;
    } else {
      dispatch(uploadAssignmentFailure("Failed to upload the file"));
      return null;
    }
  } catch (error) {
    dispatch(
      uploadAssignmentFailure(error.message || "Error uploading the file")
    );
    return null;
  }
};

export const submitAssignment = (submittedData) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/Student/submitAssignment`,
      submittedData,
      { headers: { "Content-Type": "application/json" } }
    );

    // console.log("result from submit assignment handler: ", result.data.message);

    if (result.data?.message) {
      dispatch(submitAssignmentSuccess(result.data.message));
      return result.data.message;
    } else {
      const errorMessage = "Failed to post the assignment";
      dispatch(getFailed(errorMessage));
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error posting the assignment";

    dispatch(getError(errorMessage));
    throw new Error(errorMessage);
  }
};

export const fetchTeacherAssignments =
  (classId, subjectId) => async (dispatch) => {
    dispatch(getRequest());
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/Teacher/getAssignments/${classId}/${subjectId}`
      );

      // console.log("result from fetch assignment: ", result.data);

      if (result.data) {
        dispatch(getAssignmentsSuccess(result.data));
      } else {
        dispatch(
          getFailed("No assignments found for the given class and subject")
        );
      }
    } catch (error) {
      dispatch(getError(error.message || "Error fetching assignments"));
    }
  };

export const fetchAssignmentSubmissions =
  (assignmentId) => async (dispatch) => {
    dispatch(getRequest());
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/Teacher/getSubmissions/${assignmentId}`
      );

      // console.log("result from submissions: ", result.data);

      if (result.data) {
        dispatch(getSubmissionsSuccess(result.data)); // Use assignments state to store submissions temporarily
      } else {
        dispatch(getFailed("No submissions found for this assignment"));
      }
    } catch (error) {
      dispatch(getError(error.message || "Error fetching submissions"));
    }
  };
