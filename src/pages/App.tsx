import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Card,
  CardMedia,
  CardContent,
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

export default function HomePage() {
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

      {/* Categories Section using Flexbox */}
      <Box sx={{ maxWidth: "1200px", mx: "auto", py: 12, px: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center", mb: 8 }}
        >
          Popular Categories
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {categories.map((cat) => (
            <Card
              key={cat.name}
              sx={{
                width: { xs: "45%", md: "23%" },
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 2,
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardMedia
                component="img"
                height="150"
                image={cat.img}
                alt={cat.name}
                sx={{
                  transition: "0.4s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography
                  sx={{ fontWeight: "600", "&:hover": { color: "green" } }}
                >
                  {cat.name}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Call-to-Action Section */}
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
