import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  postAssignment,
  uploadFile,
  fetchTeacherAssignments,
  fetchAssignmentSubmissions,
} from "../../redux/assignmentRelated/assignmentHandle";

const Input = styled("input")({
  display: "none",
});

const TeacherAssignments = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { assignments, submissions } = useSelector((state) => state.assignment); // Assuming you have a slice for assignments
  const [showSubmissions, setShowSubmissions] = useState(null); // Track toggled submission views

  const classId = currentUser.teachSclass?._id;
  const subjectId = currentUser.teachSubject?._id;

  const [selectedFile, setSelectedFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    deadline: "",
    description: "",
    fileURL: "",
    classId,
    subjectId,
  });

  useEffect(() => {
    if (classId && subjectId) {
      dispatch(fetchTeacherAssignments(classId, subjectId));
    }
  }, [dispatch, classId, subjectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      const response = await dispatch(uploadFile(selectedFile));
      if (response && response?.fileURL) {
        setFormData({ ...formData, fileURL: response.fileURL });
        alert("File uploaded successfully!");
      } else {
        alert("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.deadline || !formData.description || !formData.fileURL) {
      alert(
        "Please fill in all the required fields, including uploading a file."
      );
      return;
    }

    try {
      dispatch(postAssignment(formData));
      alert("Assignment added successfully!");
      setSubmitted(true);

      // Reset the form
      setFormData({
        deadline: "",
        description: "",
        fileURL: "",
        classId,
        subjectId,
      });

      // Re-fetch assignments to reflect the new addition
      dispatch(fetchTeacherAssignments(classId, subjectId));
    } catch (error) {
      console.error("Error adding assignment:", error);
      alert("Error adding assignment.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Invalid date";
    }

    const date = new Date(dateString);
    if (isNaN(date)) {
      return "Invalid date";
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // console.log("submissions: ", submissions);
  // console.log("show submissions: ", showSubmissions);

  const handleShowSubmissions = async (assignmentId) => {
    if (showSubmissions === assignmentId) {
      setShowSubmissions(null);
    } else {
      try {
        await dispatch(fetchAssignmentSubmissions(assignmentId));
        setShowSubmissions(assignmentId);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        alert("Error fetching submissions.");
      }
    }
  };

  // console.log("show submissions: ", showSubmissions);
  // console.log("submissions: ", submissions);

  return (
    <>
      <Typography variant="h3" align="center">
        Class Assignment
      </Typography>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Deadline"
                name="deadline"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.deadline}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                required
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="upload-file">
                <Input
                  id="upload-file"
                  name="assignmentFile"
                  type="file"
                  onChange={handleFileChange}
                />
                <Button
                  variant="contained"
                  component="span"
                  sx={{ marginRight: 2 }}
                >
                  Choose File
                </Button>
                {!submitted && selectedFile ? (
                  <Typography>{selectedFile.name}</Typography>
                ) : null}
              </label>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleFileUpload}
              >
                Upload File
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Add Assignment
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Assignment List */}
      <Typography variant="h4" align="center" sx={{ marginTop: 4 }}>
        Posted Assignments
      </Typography>
      <Box sx={{ maxWidth: 600, margin: "auto" }}>
        {assignments?.map((assignment) => (
          <Paper
            key={assignment._id}
            elevation={3}
            sx={{ padding: 2, marginBottom: 2, borderRadius: 2 }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Deadline: {formatDate(assignment.deadline)}
              </Typography>
              <Typography gutterBottom>
                Description: {assignment.description}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  marginBottom: 1,
                  backgroundColor: "#1976d2",
                  color: "white",
                  textTransform: "none",
                  width: "350px",
                }}
                onClick={() => window.open(assignment.fileURL, "_blank")}
              >
                View Assignment
              </Button>
              <Divider sx={{ marginY: 2, width: "100%" }} />
              <Button
                variant="contained"
                color="secondary"
                sx={{ width: "450px" }}
                onClick={() => handleShowSubmissions(assignment._id)}
              >
                {showSubmissions === assignment._id
                  ? "Hide Submissions"
                  : "Show Submissions"}
              </Button>

              {/* Submission List - Collapsible */}
              <Collapse
                in={showSubmissions === assignment._id}
                sx={{ marginRight: "160px" }}
              >
                <List sx={{ width: "160%" }}>
                  <ListItem
                    sx={{ fontWeight: "bold", borderBottom: "1px solid #ddd" }}
                  >
                    <Typography sx={{ width: "20%", fontWeight: "bold" }}>
                      Sr. No
                    </Typography>
                    <Typography sx={{ width: "40%", fontWeight: "bold" }}>
                      Name
                    </Typography>
                    <Typography sx={{ width: "30%", fontWeight: "bold" }}>
                      Roll No
                    </Typography>
                    <Typography sx={{ width: "20%", fontWeight: "bold" }}>
                      Submitted File
                    </Typography>
                  </ListItem>

                  {submissions?.length > 0 ? (
                    submissions.map((student, index) => (
                      <ListItem
                        key={student._id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <Typography sx={{ width: "20%" }}>
                          {index + 1}.
                        </Typography>
                        <Typography sx={{ width: "40%" }}>
                          {student.name}
                        </Typography>
                        <Typography sx={{ width: "30%" }}>
                          {student.rollNo}
                        </Typography>
                        <Typography sx={{ width: "20%" }}>
                          {student.file ? (
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() =>
                                window.open(student.file, "_blank")
                              }
                            >
                              View
                            </Button>
                          ) : (
                            "No file"
                          )}
                        </Typography>
                      </ListItem>
                    ))
                  ) : (
                    <Typography
                      sx={{
                        textAlign: "center",
                        width: "100%",
                        fontStyle: "italic",
                      }}
                    >
                      No submissions yet
                    </Typography>
                  )}
                </List>
              </Collapse>
            </Box>
          </Paper>
        ))}
      </Box>
    </>
  );
};

export default TeacherAssignments;
