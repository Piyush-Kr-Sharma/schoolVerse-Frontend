import axios from "axios";
import {
  getRequest,
  markAttendanceSuccess,
  getPercentageSuccess,
  getFailed,
  getError,
  getSuccess,
  resetAttendanceState,
} from "./attendanceSlice";

// 1. Mark students' attendance (POST /StudentsAttendance)
export const markStudentsAttendance =
  (classId, subjectId, date, records) => async (dispatch) => {
    dispatch(getRequest());

    try {
      const payload = {
        classId,
        subjectId,
        date,
        attendanceRecords: records, // Array of { studentId, present }
      };

      console.log("payload: ", payload);

      const result = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/StudentsAttendance`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("result of marked attendance: ", result);

      if (result.data?.message) {
        dispatch(getFailed(result.data.message));
      } else {
        dispatch(markAttendanceSuccess("Attendance marked successfully!"));
      }
    } catch (error) {
      dispatch(getError(error.message || "Failed to mark attendance"));
    }
  };

// 2. Get attendance percentage (GET /percentage/:studentId/:subjectId)
export const getAttendancePercentage =
  (studentId, subjectId) => async (dispatch) => {
    dispatch(getRequest());

    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/percentage/${studentId}/${subjectId}`
      );

      // console.log(result.data.percentage);

      if (result.data?.message) {
        dispatch(getFailed(result.data.message));
      } else {
        dispatch(getPercentageSuccess(result.data?.percentage));
      }
    } catch (error) {
      dispatch(
        getError(error.message || "Unable to fetch attendance percentage")
      );
    }
  };

// 3. Get attendance records by date
export const getAttendanceByDate =
  (classId, subjectId, date) => async (dispatch) => {
    dispatch(getRequest());
    dispatch(resetAttendanceState());

    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/attendance/${classId}/${subjectId}/${date}`
      );

      if (result.data?.message) {
        dispatch(getFailed(result.data.message));
      } else {
        dispatch(getSuccess(result.data.records));
      }
    } catch (error) {
      dispatch(getError(error.message || "Failed to fetch attendance records"));
    }
  };
