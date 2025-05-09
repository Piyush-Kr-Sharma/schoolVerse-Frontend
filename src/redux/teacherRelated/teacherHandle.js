import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  postDone,
  doneSuccess,
  sendMailSuccess,
  sendMailFailed,
} from "./teacherSlice";

export const getAllTeachers = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Teachers/${id}`
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getTeacherDetails = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Teacher/${id}`
    );
    if (result.data) {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const updateTeachSubject =
  (teacherId, teachSubject) => async (dispatch) => {
    dispatch(getRequest());

    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/TeacherSubject`,
        { teacherId, teachSubject },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(postDone());
    } catch (error) {
      dispatch(getError(error));
    }
  };

export const teacherSendMail = (mailData) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/Teacher/SendMail`,
      mailData,
      { headers: { "Content-Type": "application/json" } }
    );

    if (result.data?.message) {
      dispatch(sendMailSuccess(result.data.message)); // Dispatch success action with the response message
    } else {
      dispatch(sendMailFailed("Failed to send the mail")); // Dispatch failure action if message is not present
    }
  } catch (error) {
    dispatch(getError(error.message || "An error occurred while sending mail")); // Dispatch error action
  }
};
