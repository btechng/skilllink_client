// src/pages/Login.tsx
import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  InputAdornment,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../components/api";
import { useAuth } from "../context/useAuth";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // ⬅️ NEW
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true); // ⬅️ Start loading

    try {
      const { data } = await api.post("/api/auth/login", { email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      setMsg("✅ Logged in successfully!");
      navigate("/dashboard");
    } catch (e: any) {
      setMsg(e.response?.data?.message || "❌ Error logging in");
    } finally {
      setLoading(false); // ⬅️ End loading
    }
  };

  return (
    <>
      {/* Backdrop Loader */}
      <Backdrop
        open={loading}
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
        }}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Logging you in...
        </Typography>
      </Backdrop>

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
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={() => setShowPassword((prev) => !prev)}
                        sx={{ minWidth: "auto", p: 0 }}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading} // ⬅️ Disable while loading
              >
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
    </>
  );
};

export default Login;
