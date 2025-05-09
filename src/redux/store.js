import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userRelated/userSlice";
import { studentReducer } from "./studentRelated/studentSlice";
import { noticeReducer } from "./noticeRelated/noticeSlice";
import { sclassReducer } from "./sclassRelated/sclassSlice";
import { teacherReducer } from "./teacherRelated/teacherSlice";
import { complainReducer } from "./complainRelated/complainSlice";
import { attendanceReducer } from "./attendanceRelated/attendanceSlice";
import { assignmentReducer } from "./assignmentRelated/assignmentSlice";
import { feeReducer } from "./feeRelated/feeSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    student: studentReducer,
    teacher: teacherReducer,
    notice: noticeReducer,
    complain: complainReducer,
    sclass: sclassReducer,
    attendance: attendanceReducer,
    assignment: assignmentReducer,
    fee: feeReducer,
  },
});

export default store;
