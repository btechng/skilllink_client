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
} from "@mui/material";

// ✅ Import category images
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

// 🔹 Types
type User = {
  _id: string;
  name: string;
  title: string;
  skills: string[];
  profileImage: string;
};

export default function App() {
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

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
    api.get("/api/users/freelancers").then((res) => setFreelancers(res.data));
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

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
      </Box>

      {/* Categories Section */}
      <Box sx={{ maxWidth: "1200px", mx: "auto", py: 8, px: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center", mb: 5 }}
        >
          Popular Categories
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 3,
          }}
        >
          {categories.map((cat) => (
            <Card
              key={cat.name}
              sx={{
                width: { xs: "48%", sm: "32%", md: "23%" },
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 2,
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
        {userRole === "client" ? (
          <Button
            component={Link}
            to="/jobs/new"
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
        ) : (
          <Typography color="textSecondary">
            Only clients can post jobs. Please register as a client.
          </Typography>
        )}
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
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 3,
          }}
        >
          {freelancers.slice(0, 8).map((user) => (
            <Card
              key={user._id}
              sx={{
                width: { xs: "48%", sm: "32%", md: "23%" },
                borderRadius: 3,
                boxShadow: 2,
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-5px) scale(1.03)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
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

                <Button
                  component={Link}
                  to={`/freelancers/${user._id}`}
                  variant="outlined"
                  sx={{
                    mt: 2,
                    transition: "0.3s",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
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
    </Box>
  );
}
