import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../components/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [msg, setMsg] = useState<string | null>(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);

    try {
      // ✅ Use api helper from api.ts
      const { data } = await api.post("/api/auth/login", { email, password });

      // Store token
      localStorage.setItem("token", data.token);

      // Update global user state
      setUser(data.user);

      // Success message
      setMsg("✅ Logged in successfully!");

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (e: any) {
      setMsg(e.response?.data?.message || "❌ Error logging in");
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>

        <form onSubmit={submit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </Box>
        </form>

        {msg && (
          <Alert
            severity={msg.startsWith("✅") ? "success" : "error"}
            sx={{ mt: 3 }}
          >
            {msg}
          </Alert>
        )}

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Button
              onClick={() => navigate("/register")}
              size="small"
              sx={{ textTransform: "none" }}
            >
              Register
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
