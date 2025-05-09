import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";
import {
  Button,
  Table,
  TableBody,
  TableHead,
  Typography,
  TableContainer,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../components/styles";
import { useNavigate } from "react-router-dom";
import { resetAssignmentState } from "../../redux/assignmentRelated/assignmentSlice";

const AssignmentPage = () => {
  const dispatch = useDispatch();
  const { subjectsList } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector((state) => state.user);
  const classId = currentUser.sclassName._id;
  const navigate = useNavigate();

  useEffect(() => {
    if (classId) {
      dispatch(getSubjectList("ClassSubjects", classId));
    }

    // Cleanup function to reset assignments when leaving the page
    return () => {
      dispatch(resetAssignmentState());
    };
  }, [dispatch, classId]);

  const handleViewAssignments = (subjectId) => {
    console.log(`View assignments for subject ID: ${subjectId}`);
    navigate(`/Student/assignments/${subjectId}`);
  };

  const renderAssignmentTable = () => {
    return (
      <>
        <Typography variant="h4" align="center" gutterBottom>
          List of Assignments - Subject Wise
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Subject</StyledTableCell>
                <StyledTableCell sx={{ textAlign: "center" }}>
                  Action
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {subjectsList.map((subject, index) => {
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{subject.subName}</StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewAssignments(subject._id)}
                      >
                        View Assignments
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  return <>{renderAssignmentTable()}</>;
};

export default AssignmentPage;
