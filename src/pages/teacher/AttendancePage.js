import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  markStudentsAttendance,
  getAttendanceByDate,
} from "../../redux/attendanceRelated/attendanceHandle";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  Checkbox,
  CircularProgress,
  TableContainer,
  Paper,
} from "@mui/material";
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";

const AttendancePage = () => {
  const dispatch = useDispatch();

  // Redux State
  const { sclassStudents, loading, error } = useSelector(
    (state) => state.sclass
  );
  const { attendanceList } = useSelector((state) => state.attendance);
  const { currentUser } = useSelector((state) => state.user);

  // Local State
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // default to today's date
  const [studentsAttendanceList, setStudentsAttendanceList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const classId = currentUser.teachSclass?._id;
  const subjectId = currentUser.teachSubject?._id;

  // Fetch Students and Attendance Records
  useEffect(() => {
    dispatch(getClassStudents(classId));
    dispatch(getAttendanceByDate(classId, subjectId, selectedDate));
  }, [dispatch, classId, subjectId, selectedDate]);

  // Handle Date Change
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    // Re-fetch attendance data for the selected date
    dispatch(getAttendanceByDate(classId, subjectId, event.target.value));
  };

  // Update Attendance State Locally
  const handleAttendanceChange = (studentId, status) => {
    setStudentsAttendanceList((prevList) => {
      const updatedList = [...prevList]; // spread the list and assign the list to the updated list
      const studentIndex = updatedList.findIndex(
        (item) => item.studentId === studentId
      ); // find the index of student which we have marked now
      if (studentIndex >= 0) {
        // means the student's attendance is already present in list
        updatedList[studentIndex].status = status;
      } else {
        updatedList.push({ studentId, status });
      }
      // console.log("attendance status: ", updatedList[studentIndex].status);
      return updatedList;
    });
  };

  // Mark Attendance on Submit
  const handleMarkAttendance = async () => {
    const records = studentsAttendanceList.map((item) => ({
      studentId: item.studentId,
      status: item.status,
    }));
    setSubmitting(true);
    try {
      await dispatch(
        markStudentsAttendance(classId, subjectId, selectedDate, records)
      );
      // Fetch updated attendance records
      dispatch(getAttendanceByDate(classId, subjectId, selectedDate));
    } catch (error) {
      console.error("Error marking attendance:", error);
    } finally {
      setSubmitting(false); // Reset the submission status
    }
  };

  useEffect(() => {
    if (attendanceList?.length) {
      // attendanceList is the list of atttendance records for the day coming from backend and studentsAttendanceList is the list of attendance for the current day
      // attendanceList ki sari list's studentsAttendanceList me daal do
      setStudentsAttendanceList(
        attendanceList.map((record) => ({
          studentId: record.studentId?._id,
          status: record.status,
        }))
      );
    } else if (sclassStudents?.length) {
      // Populate attendanceList with default values if no attendance records exist
      setStudentsAttendanceList(
        sclassStudents.map((student) => ({
          studentId: student._id,
          status: null, // Default status
        }))
      );
    }
  }, [attendanceList, sclassStudents]);

  const renderAttendanceRows = () => {
    if (attendanceList?.length) {
      return attendanceList.map((record, index) => (
        <TableRow key={index}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{record.name}</TableCell>
          <TableCell>{record.rollNum}</TableCell>
          <TableCell>{record.status}</TableCell>
        </TableRow>
      ));
    } else if (studentsAttendanceList?.length) {
      // console.log("students list: ", sclassStudents);
      return studentsAttendanceList?.map((student, index) => (
        <TableRow key={student.studentId}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>
            {sclassStudents.find((s) => s._id === student.studentId)?.name}
          </TableCell>
          <TableCell>
            {sclassStudents.find((s) => s._id === student.studentId)?.rollNum}
          </TableCell>
          <TableCell gap={2}>
            <Checkbox
              checked={student.status === "Present"}
              onChange={() =>
                handleAttendanceChange(student.studentId, "Present")
              }
            />
            Present
            <Checkbox
              checked={student.status === "Absent"}
              onChange={() =>
                handleAttendanceChange(student.studentId, "Absent")
              }
            />
            Absent
            <Checkbox
              checked={student.status === "Absent with Apology"}
              onChange={() =>
                handleAttendanceChange(student.studentId, "Absent with Apology")
              }
            />
            Absent with Apology
          </TableCell>
        </TableRow>
      ));
    }
    return null;
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" gap={2} marginTop={3}>
        <Typography variant="h4" gutterBottom>
          Mark Attendance for {selectedDate}
        </Typography>

        <TextField
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Serial No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Roll No</TableCell>
                <TableCell>
                  {attendanceList.length > 0
                    ? "Attendance Status"
                    : "Take Attendance"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderAttendanceRows()}</TableBody>
          </Table>
        </TableContainer>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleMarkAttendance}
        sx={{ marginTop: 2 }}
        disabled={
          submitting ||
          loading ||
          !studentsAttendanceList.length ||
          attendanceList.length > 0
        }
      >
        {submitting ? "Marking Attendance..." : "Mark Attendance"}
      </Button>

      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error.message || "Something went wrong!"}
        </Typography>
      )}
    </Container>
  );
};

export default AttendancePage;
