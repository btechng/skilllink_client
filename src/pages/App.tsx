import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../components/api";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

import designImg from "../images/Graphics_Design.png";
import webImg from "../images/Web_Development.png";
import marketingImg from "../images/Digital_Marketing.png";
import writingImg from "../images/Writing_Translation.png";
import videoImg from "../images/Video_Animation.png";
import musicImg from "../images/Music_Audio.png";
import businessImg from "../images/Business.png";
import lifestyleImg from "../images/Lifestyle.png";
import heroBg from "../images/boygirl.gif";
import ctaBg from "../images/group.gif";

type User = {
  _id: string;
  name: string;
  title: string;
  skills: string[];
  profileImage: string;
};

export default function App() {
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState<User[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<User | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [openHireModal, setOpenHireModal] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [budget, setBudget] = useState<number>(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const categories = [
    { name: "Graphics & Design", img: designImg },
    { name: "Web Development", img: webImg },
    { name: "Digital Marketing", img: marketingImg },
    { name: "Writing & Translation", img: writingImg },
    { name: "Video & Animation", img: videoImg },
    { name: "Music & Audio", img: musicImg },
    { name: "Business", img: businessImg },
    { name: "Lifestyle", img: lifestyleImg },
  ];

  useEffect(() => {
    api.get("/api/freelancers").then((res) => {
      setFreelancers(res.data);
      setFilteredFreelancers(res.data);
    });
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  useEffect(() => {
    const filtered = freelancers.filter(
      (f) =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredFreelancers(filtered);
  }, [searchTerm, freelancers]);

  const handleSendMessage = async () => {
    if (!selectedFreelancer || !message.trim()) return;

    try {
      await api.post("/api/messages", {
        to: selectedFreelancer._id,
        content: message,
      });

      setSnackbarMessage("Message sent successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setMessage("");
      setOpenMessageModal(false);
      setSelectedFreelancer(null);
    } catch (err: any) {
      console.error(err);
      setSnackbarMessage("Failed to send message.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handlePostJob = async () => {
    if (!selectedFreelancer || !jobTitle.trim()) return;

    try {
      await api.post("/api/jobs/new", {
        title: jobTitle,
        description: jobDescription,
        budget: budget,
        freelancer: selectedFreelancer._id,
      });

      setSnackbarMessage("Job posted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setJobTitle("");
      setJobDescription("");
      setOpenHireModal(false);
      setSelectedFreelancer(null);
    } catch (err: any) {
      console.error(err);
      setSnackbarMessage("Failed to post job.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ fontFamily: "Inter, system-ui" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          py: { xs: 10, md: 14 },
          px: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            mb: 3,
            fontSize: { xs: "2rem", md: "3.5rem" },
          }}
        >
          Find the perfect{" "}
          <Box component="span" sx={{ color: "yellow" }}>
            freelancer
          </Box>{" "}
          for your project
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 5 }}>
          Skilled professionals across design, tech, marketing, and more.
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            maxWidth: 600,
            mx: "auto",
            display: "flex",
            alignItems: "center",
            bgcolor: "white",
            borderRadius: 50,
            overflow: "hidden",
            boxShadow: 3,
          }}
        >
          <TextField
            fullWidth
            placeholder="Try 'Web Developer'"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              sx: { borderRadius: 0, pl: 2 },
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "green.600",
                      px: 4,
                      borderRadius: 0,
                      "&:hover": { bgcolor: "green.700" },
                    }}
                  >
                    🔍 Search
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* CTA Button */}
        <Box sx={{ mt: 6 }}>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            sx={{
              bgcolor: "yellow",
              color: "black",
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              "&:hover": { bgcolor: "gold" },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>

      {/* Categories Section */}
      <Box sx={{ maxWidth: "1200px", mx: "auto", py: 12, px: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center", mb: 8 }}
        >
          Categories
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {categories.map((cat) => (
            <Card
              key={cat.name}
              component={Link}
              to={`/freelancers/skills/${encodeURIComponent(cat.name)}`}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 2,
                textDecoration: "none",
                color: "inherit",
                transition: "0.3s ease-in-out",
                cursor: "pointer",
                "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
              }}
            >
              <CardMedia
                component="img"
                image={cat.img}
                alt={cat.name}
                sx={{
                  width: "100%",
                  height: { xs: 100, sm: 120, md: 150 },
                  objectFit: "cover",
                  transition: "0.4s",
                }}
              />
              <CardContent sx={{ textAlign: "center", py: 1 }}>
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                    "&:hover": { color: "green" },
                  }}
                >
                  {cat.name}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Post Job Section */}
      <Box sx={{ textAlign: "center", py: 8, px: 3, bgcolor: "#f5f5f5" }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Hire a Freelancer
        </Typography>
        <Button
          component={Link}
          to="/jobs"
          variant="contained"
          sx={{
            bgcolor: "green.600",
            "&:hover": { bgcolor: "green.700" },
            px: 5,
            py: 2,
          }}
        >
          Post a Job
        </Button>
      </Box>

      {/* Featured Freelancers Section */}
      <Box sx={{ maxWidth: "1200px", mx: "auto", py: 8, px: 3 }}>
        <Typography
          variant="h4"
          sx={{ mb: 5, fontWeight: "bold", textAlign: "center" }}
        >
          Featured Freelancers
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {filteredFreelancers.slice(0, 8).map((user) => (
            <Card
              key={user._id}
              component={Link}
              to={`/freelancers/${user._id}`}
              sx={{
                borderRadius: 3,
                boxShadow: 2,
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
                height: "100%",
              }}
            >
              <CardContent
                sx={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Avatar
                    src={user.profileImage}
                    sx={{
                      width: 70,
                      height: 70,
                      mx: "auto",
                      mb: 1,
                      transition: "0.3s",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  />
                  <Typography sx={{ fontWeight: "600" }}>
                    {user.name}
                  </Typography>
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
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedFreelancer(user);
                      setOpenMessageModal(true);
                    }}
                    variant="outlined"
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                  >
                    Connect / Message
                  </Button>
                  {userRole === "client" && (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedFreelancer(user);
                        setOpenHireModal(true);
                      }}
                      variant="contained"
                      sx={{
                        bgcolor: "green.600",
                        "&:hover": { bgcolor: "green.700" },
                        mt: { xs: 1, sm: 0 },
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      Hire
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundImage: `url(${ctaBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "white",
          py: 12,
          px: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          .
        </Typography>
        <Typography sx={{ mb: 5, color: "gray.400" }}>.</Typography>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          sx={{
            bgcolor: "green.600",
            px: 5,
            py: 2,
            fontWeight: "bold",
            "&:hover": { bgcolor: "green.700" },
          }}
        >
          Join Now
        </Button>
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
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <TextField
            fullWidth
            label="Budget"
            variant="outlined"
            multiline
            rows={4}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
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
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
}
