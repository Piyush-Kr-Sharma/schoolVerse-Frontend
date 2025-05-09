import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Grid, Typography, Paper, Box } from "@mui/material";
import { teacherSendMail } from "../../redux/teacherRelated/teacherHandle";
import { useParams } from "react-router-dom";

const TeacherMailForm = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user); // Get current user details

  const teacherId = currentUser?._id || ""; // Extract teacherId from currentUser
  const { studentId } = useParams();
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.description) {
      alert("Please fill in all the fields.");
      return;
    }

    // Create mailData object to send to the API
    const mailData = {
      subject: formData.subject,
      description: formData.description,
      studentId, // Provided via props
      teacherId, // Extracted from currentUser
    };

    // Dispatch the function to send the mail
    dispatch(teacherSendMail(mailData))
      .then(() => {
        alert("Mail sent successfully!");
        setFormData({ subject: "", description: "" }); // Reset the form
      })
      .catch((error) => {
        console.error("Error sending mail:", error);
        alert("Failed to send mail.");
      });
  };

  return (
    <>
      <Typography variant="h3" align="center">
        Send Mail to Student's Parent
      </Typography>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Send Mail
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default TeacherMailForm;
