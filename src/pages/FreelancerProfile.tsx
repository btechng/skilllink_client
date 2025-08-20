import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [openHireModal, setOpenHireModal] = useState(false);
  const [message, setMessage] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobBudget, setJobBudget] = useState<number | "">("");

  useEffect(() => {
    api.get(`/api/freelancers/${id}`).then((res) => setFreelancer(res.data));
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, [id]);

  const handleSendMessage = () => {
    console.log("Message sent:", message, "to freelancer ID:", freelancer?._id);
    // TODO: integrate API call to send message
    setMessage("");
    setOpenMessageModal(false);
  };

  const handleHire = () => {
    if (!freelancer) return;
    const payload = {
      title: jobTitle,
      budget: jobBudget,
      freelancerId: freelancer._id, // automatically associate with this freelancer
    };
    console.log("Job posted:", payload);
    // TODO: POST payload to /api/jobs
    setJobTitle("");
    setJobBudget("");
    setOpenHireModal(false);
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
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <TextField
            label="Budget ($)"
            variant="outlined"
            type="number"
            fullWidth
            value={jobBudget}
            onChange={(e) => setJobBudget(Number(e.target.value))}
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
    </Box>
  );
}
