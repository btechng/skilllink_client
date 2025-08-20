import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../components/api";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

type Freelancer = {
  _id: string;
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  skills: string[];
  hourlyRate?: number;
};

export default function FreelancerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [openHireModal, setOpenHireModal] = useState(false);
  const [message, setMessage] = useState("");

  // Job form state
  const [jobTitle, setJobTitle] = useState("");
  const [jobBudget, setJobBudget] = useState<number | "">("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobCategory, setJobCategory] = useState("");

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("info");

  useEffect(() => {
    api.get(`/api/freelancers/${id}`).then((res) => setFreelancer(res.data));
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, [id]);

  const handleSendMessage = async () => {
    if (!freelancer || !message.trim()) return;

    try {
      await api.post("/api/messages", {
        to: freelancer._id,
        content: message,
      });

      setSnackbarMessage("Message sent successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setMessage("");
      setOpenMessageModal(false);
    } catch (err: any) {
      console.error(
        "Failed to send message:",
        err.response?.data || err.message
      );

      setSnackbarMessage("Failed to send message. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleHire = async () => {
    if (!freelancer || !jobTitle.trim() || !jobBudget) return;

    try {
      const payload = {
        title: jobTitle,
        budget: jobBudget,
        description: jobDescription,
        category: jobCategory,
        freelancer: freelancer._id, // assign freelancer directly
      };

      await api.post("/api/jobs", payload);

      setSnackbarMessage("Job posted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // reset form
      setJobTitle("");
      setJobBudget("");
      setJobDescription("");
      setJobCategory("");
      setOpenHireModal(false);

      // redirect to jobs page
      setTimeout(() => navigate("/jobs"), 1200);
    } catch (err: any) {
      console.error("Failed to post job:", err.response?.data || err.message);

      setSnackbarMessage("Failed to post job. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  if (!freelancer) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 6, px: 3 }}>
      {/* Freelancer Info */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Avatar
          src={freelancer.profileImage}
          sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
        />
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {freelancer.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {freelancer.title}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {freelancer.bio}
        </Typography>
      </Box>

      {/* Skills */}
      <Box sx={{ mb: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
        {freelancer.skills.map((skill) => (
          <Chip key={skill} label={skill} />
        ))}
      </Box>

      {/* Hourly Rate */}
      {freelancer.hourlyRate && (
        <Typography variant="h6" sx={{ mb: 3 }}>
          Hourly Rate: ${freelancer.hourlyRate}
        </Typography>
      )}

      {/* Connect / Hire Buttons */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        {userRole === "client" ? (
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenMessageModal(true)}
            >
              Connect / Message
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => setOpenHireModal(true)}
            >
              Hire
            </Button>
          </Box>
        ) : (
          <Typography color="textSecondary">
            Only clients can message or hire freelancers. Please register as a
            client.
          </Typography>
        )}
      </Box>

      {/* Message Modal */}
      <Dialog
        open={openMessageModal}
        onClose={() => setOpenMessageModal(false)}
        fullWidth
      >
        <DialogTitle>Send a Message to {freelancer.name}</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMessageModal(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            color="primary"
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hire Modal */}
      <Dialog
        open={openHireModal}
        onClose={() => setOpenHireModal(false)}
        fullWidth
      >
        <DialogTitle>Hire {freelancer.name}</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Job Title"
            variant="outlined"
            fullWidth
            required
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <TextField
            label="Budget ($)"
            variant="outlined"
            type="number"
            fullWidth
            required
            value={jobBudget}
            onChange={(e) => setJobBudget(Number(e.target.value))}
          />
          <TextField
            label="Description"
            variant="outlined"
            multiline
            rows={3}
            fullWidth
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            value={jobCategory}
            onChange={(e) => setJobCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHireModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleHire} variant="contained" color="success">
            Post Job
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Toast */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
