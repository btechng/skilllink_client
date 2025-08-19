import React, { useState } from "react";
import api from "../components/api";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
} from "@mui/material";

export default function PostJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      await api.post("/api/jobs", { title, description, budget, category });
      setMsg("✅ Job posted successfully!");
      setTitle("");
      setDescription("");
      setBudget("");
      setCategory("");
    } catch (e: any) {
      setMsg(e.response?.data?.message || "❌ Error posting job");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom align="center">
          Post a Job (Client)
        </Typography>

        <Box
          component="form"
          onSubmit={submit}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
          />

          <TextField
            label="Budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            required
            fullWidth
          />

          <TextField
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create Job
          </Button>
        </Box>

        {msg && (
          <Alert
            severity={msg.startsWith("✅") ? "success" : "error"}
            sx={{ mt: 3 }}
          >
            {msg}
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
