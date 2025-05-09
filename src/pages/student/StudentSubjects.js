import { useDispatch, useSelector } from "react-redux";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";
import {
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Paper,
  Table,
  TableBody,
  TableHead,
  Typography,
} from "@mui/material";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import CustomBarChart from "../../components/CustomBarChart";

import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import { StyledTableCell, StyledTableRow } from "../../components/styles";
import { useEffect, useState } from "react";

const StudentSubjects = () => {
  const dispatch = useDispatch();
  const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
  const { userDetails, currentUser, loading, response, error } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getUserDetails(currentUser._id, "Student"));
  }, [dispatch, currentUser._id]);

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  const [subjectMarks, setSubjectMarks] = useState([]);
  const [selectedSection, setSelectedSection] = useState("table");

  useEffect(() => {
    if (userDetails) {
      setSubjectMarks(userDetails.examResult || []);
    }
  }, [userDetails]);

  useEffect(() => {
    if (subjectMarks === []) {
      dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
    }
  }, [subjectMarks, dispatch, currentUser.sclassName._id]);

  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const renderTableSection = () => {
    return (
      <>
        <Typography variant="h4" align="center" gutterBottom>
          Subject Marks
        </Typography>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Subject</StyledTableCell>
              <StyledTableCell>Marks</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {subjectMarks.map((result, index) => {
              if (!result.subName || !result.marksObtained) {
                return null;
              }
              return (
                <StyledTableRow key={index}>
                  <StyledTableCell>{result.subName.subName}</StyledTableCell>
                  <StyledTableCell>{result.marksObtained}</StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </>
    );
  };
  const renderChartSection = () => {
    return <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />;
  };

  const renderClassDetailsSection = () => {
    return (
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Class Details
        </Typography>
        <Typography variant="h5" gutterBottom>
          You are currently in Class {sclassDetails && sclassDetails.sclassName}
        </Typography>
        <Typography variant="h6" gutterBottom>
          And these are the subjects:
        </Typography>
        {subjectsList &&
          subjectsList.map((subject, index) => (
            <div key={index}>
              <Typography variant="subtitle1">
                {subject.subName} ({subject.subCode})
              </Typography>
            </div>
          ))}
      </Container>
    );
  };

  return (
    <>{loading ? <div>Loading...</div> : <div>{renderTableSection()} </div>}</>
  );
};

export default StudentSubjects;
