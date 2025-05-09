import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const AttendanceTable = ({ attendance }) => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Student</TableCell>
          <TableCell>Present</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {attendance.map((record) => (
          <TableRow key={record.studentId}>
            <TableCell>{record.studentName}</TableCell>
            <TableCell>{record.present ? "Yes" : "No"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
);

export default AttendanceTable;
