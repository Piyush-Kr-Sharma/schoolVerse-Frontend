import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Card, Button, Box, Divider } from "@mui/material";
import {
  getAssignments,
  submitAssignment,
  uploadAssignment,
} from "../../redux/assignmentRelated/assignmentHandle";

const SubjectAssignments = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { assignments } = useSelector((state) => state.assignment);
  const [subjectAssignments, setSubjectAssignments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);

  const userId = currentUser._id;
  const currentURL = window.location.href;
  const subjectId = currentURL.split("/").pop();

  const rollNo = currentUser.rollNum;
  const name = currentUser.name;

  useEffect(() => {
    if (subjectId) {
      dispatch(getAssignments(userId, subjectId));
    }
  }, [dispatch, subjectId]);

  useEffect(() => {
    setSubjectAssignments(assignments || []);
  }, [assignments]);

  const handleDownload = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadAndSubmit = async (assignment) => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      // Dispatch the action to upload the file
      const uploadResponse = await dispatch(uploadAssignment(selectedFile));
      // console.log("uploadResponse: ", uploadResponse);

      if (uploadResponse && uploadResponse.file) {
        setFileUploadSuccess(true);
        alert("File uploaded successfully!");

        // Prepare the data for assignment submission
        const submissionData = {
          studentId: userId,
          assignmentId: assignment._id,
          file: uploadResponse.file,
          rollNo: rollNo,
          name: name,
        };

        const message = await dispatch(submitAssignment(submissionData));
        // console.log("message from page: ", message);
        alert(message || "Assignment submitted successfully!");
      } else {
        alert("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading or submitting assignment:", error);
      alert("You have already submitted the assignment!!");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // console.log("assignment list: ", subjectAssignments);

  return (
    <Box
      sx={{
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Assignments List
      </Typography>
      {subjectAssignments.length === 0 ? (
        <Typography align="center" sx={{ mt: 4 }}>
          No assignments available
        </Typography>
      ) : (
        subjectAssignments.map((assignment) => (
          <Card
            key={assignment._id}
            sx={{
              width: "600px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              borderRadius: 3,
              p: 3,
              mb: 4,
            }}
          >
            {/* Assignment Details */}
            <Box textAlign="center" sx={{ mb: 2 }}>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                gutterBottom
              >
                <strong>Deadline:</strong> {formatDate(assignment.deadline)}
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong> {assignment.description}
              </Typography>
            </Box>

            {/* Download Button */}
            <Box display="flex" justifyContent="center" sx={{ mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleDownload(assignment.fileURL)}
                sx={{ width: "350px" }}
              >
                View Assignment
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Upload Section */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <Button variant="outlined" component="label" sx={{ px: 3 }}>
                Choose File
                <input
                  type="file"
                  name="submitAssignmentFile"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleUploadAndSubmit(assignment)}
                sx={{
                  px: 3,
                  backgroundColor: "#00796b",
                  "&:hover": { backgroundColor: "#005a4f" },
                }}
              >
                Submit Your Assignment Here
              </Button>
            </Box>
          </Card>
        ))
      )}
    </Box>
  );
};

export default SubjectAssignments;
