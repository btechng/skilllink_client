import React, { useEffect, useState } from "react";
import api from "../components/api";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Alert,
} from "@mui/material";

type Job = { _id: string; title: string };
type Transaction = { _id: string; job?: Job; amount: number; status: string };

export default function Wallet() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [authUrl, setAuthUrl] = useState<string>("");
  const [tx, setTx] = useState<Transaction[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    api.get("/api/jobs").then((r) => setJobs(r.data));
    api
      .get("/api/transactions/me")
      .then((r) => setTx(r.data))
      .catch(() => {});
  }, []);

  const fund = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const { data } = await api.post("/api/transactions/fund", {
        jobId: selectedJob,
        amount,
      });
      setAuthUrl(data.authorization_url);
      window.location.href = data.authorization_url; // redirect to Paystack
    } catch (e: any) {
      setMsg(e.response?.data?.message || "Error funding wallet");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Escrow Wallet
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Stack component="form" spacing={2} onSubmit={fund}>
          <FormControl fullWidth>
            <InputLabel>Job</InputLabel>
            <Select
              value={selectedJob}
              label="Job"
              onChange={(e) => setSelectedJob(e.target.value)}
              required
            >
              <MenuItem value="">
                <em>Select Job with accepted proposal</em>
              </MenuItem>
              {jobs.map((j) => (
                <MenuItem key={j._id} value={j._id}>
                  {j.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />

          <Button type="submit" variant="contained" color="primary">
            Fund via Paystack
          </Button>
        </Stack>
      </Paper>

      {msg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {msg}
        </Alert>
      )}

      <Typography variant="h6" gutterBottom>
        My Transactions
      </Typography>
      <Stack spacing={2}>
        {tx.map((t) => (
          <Card key={t._id} variant="outlined">
            <CardContent>
              <Typography variant="subtitle1">
                {t.job?.title} — ₦{t.amount} — {t.status}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
