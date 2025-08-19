import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "Gallery", path: "/gallery" },
    { name: "Wallet", path: "/wallet" },
  ];

  // ✅ Subtle gradient hover effect
  const gradientHover = {
    background: "linear-gradient(90deg, #10B981, #059669)",
    color: "white",
    borderRadius: 1,
    transition: "0.3s",
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar position="sticky" color="default" elevation={3}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Typography
            component={Link}
            to="/"
            sx={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              color: "green",
              textDecoration: "none",
            }}
          >
            SkillLink 💼
          </Typography>

          {/* Desktop Links */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                sx={{
                  color: location.pathname === link.path ? "green" : "gray",
                  textTransform: "none",
                  "&:hover": gradientHover,
                }}
              >
                {link.name}
              </Button>
            ))}

            <Button
              component={Link}
              to="/login"
              sx={{
                textTransform: "none",
                "&:hover": gradientHover,
              }}
            >
              Login 👤
            </Button>
            <Button
              component={Link}
              to="/register"
              sx={{
                textTransform: "none",
                bgcolor: "green.600",
                color: "white",
                "&:hover": gradientHover,
              }}
            >
              Sign Up ✨
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={() => setDrawerOpen(true)}
          >
            <span role="img" aria-label="menu">
              ☰
            </span>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            {navLinks.map((link) => (
              <ListItem
                key={link.path}
                component={Link}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  "&:hover": gradientHover,
                  borderRadius: 1,
                  color: location.pathname === link.path ? "green" : "inherit",
                  mb: 1,
                }}
              >
                <ListItemText primary={link.name} />
              </ListItem>
            ))}
            <ListItem
              component={Link}
              to="/login"
              onClick={() => setDrawerOpen(false)}
              sx={{ "&:hover": gradientHover, borderRadius: 1, mb: 1 }}
            >
              <ListItemText primary="Login 👤" />
            </ListItem>
            <ListItem
              component={Link}
              to="/register"
              onClick={() => setDrawerOpen(false)}
              sx={{
                bgcolor: "green.600",
                color: "white",
                borderRadius: 1,
                "&:hover": gradientHover,
                textAlign: "center",
              }}
            >
              <ListItemText primary="Sign Up ✨" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Page Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "gray.900",
          color: "gray.300",
          py: 10,
          mt: 4,
          px: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
            gap: 4,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
              SkillLink 💼
            </Typography>
            <Typography variant="body2">
              Connecting freelancers & businesses to bring ideas to life.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
              Explore
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                component={Link}
                to="/jobs"
                sx={{
                  color: "gray.300",
                  textTransform: "none",
                  "&:hover": gradientHover,
                }}
              >
                Find Jobs 🔍
              </Button>
              <Button
                component={Link}
                to="/gallery"
                sx={{
                  color: "gray.300",
                  textTransform: "none",
                  "&:hover": gradientHover,
                }}
              >
                Gallery 🖼️
              </Button>
              <Button
                component={Link}
                to="/wallet"
                sx={{
                  color: "gray.300",
                  textTransform: "none",
                  "&:hover": gradientHover,
                }}
              >
                Wallet 💰
              </Button>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
              Company
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                sx={{
                  color: "gray.300",
                  textTransform: "none",
                  "&:hover": gradientHover,
                }}
              >
                About Us 🏢
              </Button>
              <Button
                sx={{
                  color: "gray.300",
                  textTransform: "none",
                  "&:hover": gradientHover,
                }}
              >
                Contact ✉️
              </Button>
              <Button
                sx={{
                  color: "gray.300",
                  textTransform: "none",
                  "&:hover": gradientHover,
                }}
              >
                Careers 💼
              </Button>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
              Follow Us
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                sx={{
                  color: "gray.300",
                  textTransform: "none",
                  "&:hover": gradientHover,
                }}
              >
                Twitter 🐦
              </Button>
              <Button
                sx={{
                  color: "gray.300",
                  textTransform: "none",
                  "&:hover": gradientHover,
                }}
              >
                LinkedIn 💼
              </Button>
              <Button
                sx={{
                  color: "gray.300",
                  textTransform: "none",
                  "&:hover": gradientHover,
                }}
              >
                Instagram 📸
              </Button>
            </Box>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{ textAlign: "center", mt: 6, color: "gray.500" }}
        >
          © {new Date().getFullYear()} SkillLink. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
