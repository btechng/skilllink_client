// src/pages/FreelancersBySkill.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../components/api";
import { useAuth } from "../context/useAuth";
import { sendMessage } from "../components/api";

// 🔹 Types
type Freelancer = {
  _id: string;
  name: string;
  title: string;
  profileImage: string;
  skills: string[];
};

const FreelancersBySkill: React.FC = () => {
  const { skill } = useParams<{ skill: string }>();
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);

  const { user: currentUser } = useAuth();
  const userRole = currentUser?.role;

  // Message Modal
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] =
    useState<Freelancer | null>(null);
  const [message, setMessage] = useState("");

  // Hire Modal
  const [openHireModal, setOpenHireModal] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobBudget, setJobBudget] = useState<number | "">("");

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // Fetch freelancers by skill
  useEffect(() => {
    if (!skill) return;
    setLoading(true);
    api
      .get(`/api/freelancers?skill=${encodeURIComponent(skill)}`)
      .then((res) => setFreelancers(res.data))
      .catch((err) => console.error("Error fetching freelancers:", err))
      .finally(() => setLoading(false));
  }, [skill]);

  // Snackbar helper
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Send message
  const handleSendMessage = async () => {
    if (!selectedFreelancer || !message.trim()) return;

    try {
      await sendMessage({
        to: selectedFreelancer._id,
        content: message,
      });
      setMessage("");
      setOpenMessageModal(false);
      setSelectedFreelancer(null);
      showSnackbar("Message sent successfully!", "success");
    } catch (err) {
      console.error("Message error:", err);
      showSnackbar("Failed to send message.", "error");
    }
  };

  // Post job
  const handlePostJob = async () => {
    if (!selectedFreelancer || !jobTitle.trim()) return;

    try {
      await api.post("/api/jobs", {
        title: jobTitle,
        description: jobDescription,
        budget: jobBudget === "" ? undefined : jobBudget,
        freelancer: selectedFreelancer._id,
      });
      setJobTitle("");
      setJobDescription("");
      setJobBudget("");
      setOpenHireModal(false);
      setSelectedFreelancer(null);
      showSnackbar("Job posted successfully!", "success");
    } catch (err) {
      console.error("Job error:", err);
      showSnackbar("Failed to post job.", "error");
    }
  };

  if (loading) return <Typography align="center">Loading...</Typography>;
  if (!freelancers.length)
    return (
      <Typography align="center">No freelancers found for {skill}</Typography>
    );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 8, px: 3 }}>
      <Typography variant="h4" sx={{ mb: 5, textAlign: "center" }}>
        Freelancers with skill: {skill}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {freelancers.map((user) => (
          <Card
            key={user._id}
            sx={{
              p: 2,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Avatar
              src={user.profileImage}
              sx={{ width: 70, height: 70, mx: "auto", mb: 1 }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontWeight: "600" }}>{user.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {user.title}
              </Typography>

              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 0.5,
                }}
              >
                {user.skills.slice(0, 3).map((skill) => (
                  <Chip key={skill} label={skill} size="small" />
                ))}
              </Box>
            </CardContent>

            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Button
                onClick={() => {
                  setSelectedFreelancer(user);
                  setOpenMessageModal(true);
                }}
                variant="outlined"
              >
                Message
              </Button>

              {userRole === "client" && (
                <Button
                  onClick={() => {
                    setSelectedFreelancer(user);
                    setOpenHireModal(true);
                  }}
                  variant="contained"
                  sx={{
                    bgcolor: "green.600",
                    "&:hover": { bgcolor: "green.700" },
                  }}
                >
                  Hire
                </Button>
              )}
            </Box>
          </Card>
        ))}
      </Box>

      {/* Message Modal */}
      <Dialog
        open={openMessageModal}
        onClose={() => setOpenMessageModal(false)}
        fullWidth
      >
        <DialogTitle>Send a Message to {selectedFreelancer?.name}</DialogTitle>
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
        <DialogTitle>Hire {selectedFreelancer?.name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Job Title"
            variant="outlined"
            sx={{ mb: 2 }}
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <TextField
            fullWidth
            label="Job Description"
            variant="outlined"
            multiline
            rows={4}
            sx={{ mb: 2 }}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <TextField
            fullWidth
            label="Budget"
            type="number"
            variant="outlined"
            value={jobBudget}
            onChange={(e) => setJobBudget(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHireModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handlePostJob} variant="contained" color="primary">
            Post Job
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FreelancersBySkill;
