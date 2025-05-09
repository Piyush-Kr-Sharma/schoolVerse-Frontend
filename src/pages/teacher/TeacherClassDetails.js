import { useEffect } from "react";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import { Paper, Box, Typography, Button } from "@mui/material";
import { BlueButton } from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";

const TeacherClassDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sclassStudents, loading, error, getresponse } = useSelector(
    (state) => state.sclass
  );

  const { currentUser } = useSelector((state) => state.user);
  const classID = currentUser.teachSclass?._id;
  const subjectID = currentUser.teachSubject?._id;

  useEffect(() => {
    dispatch(getClassStudents(classID));
  }, [dispatch, classID]);

  if (error) {
    console.log(error);
  }

  const studentColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "rollNum", label: "Roll Number", minWidth: 100 },
  ];

  const studentRows = sclassStudents.map((student) => {
    return {
      name: student.name,
      rollNum: student.rollNum,
      id: student._id,
    };
  });

  const StudentsButtonHaver = ({ row }) => {
    const handleMarks = () => {
      navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`);
    };

    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate(`/Teacher/class/student/${row.id}`)}
        >
          View
        </BlueButton>
        <Button
          variant="contained"
          color="primary"
          onClick={handleMarks}
          sx={{ marginLeft: "8px" }}
        >
          Provide Marks
        </Button>
        <BlueButton
          variant="contained"
          sx={{ marginLeft: "8px" }}
          onClick={() => navigate(`/Teacher/class/student/complain/${row.id}`)}
        >
          Student's Complain
        </BlueButton>
      </>
    );
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            Class Details
          </Typography>
          {getresponse ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "16px",
                }}
              >
                No Students Found
              </Box>
            </>
          ) : (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <Typography variant="h5" gutterBottom>
                Students List:
              </Typography>

              {Array.isArray(sclassStudents) && sclassStudents.length > 0 && (
                <TableTemplate
                  buttonHaver={StudentsButtonHaver}
                  columns={studentColumns}
                  rows={studentRows}
                />
              )}
            </Paper>
          )}
        </>
      )}
    </>
  );
};

export default TeacherClassDetails;
