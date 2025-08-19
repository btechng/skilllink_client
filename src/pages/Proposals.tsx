import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../components/api";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Stack,
  Alert,
} from "@mui/material";

type Proposal = {
  _id: string;
  freelancer?: { name: string };
  bidAmount: number;
  coverLetter: string;
  status: string;
};

export default function Proposals() {
  const { id } = useParams(); // jobId
  const [role, setRole] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState<number | "">("");
  const [list, setList] = useState<Proposal[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((r) => setRole(r.data.role))
      .catch(() => {});

    if (id) {
      api
        .get("/api/proposals/job/" + id)
        .then((r) => setList(r.data))
        .catch(() => {});
    }
  }, [id]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      await api.post("/api/proposals", { jobId: id, coverLetter, bidAmount });
      setMsg("✅ Proposal sent!");
      setCoverLetter("");
      setBidAmount("");
    } catch (e: any) {
      setMsg(e.response?.data?.message || "❌ Error sending proposal");
    }
  };

  const accept = async (pid: string) => {
    await api.post("/api/proposals/" + pid + "/accept");
    setList((list) =>
      list.map((x) => (x._id === pid ? { ...x, status: "accepted" } : x))
    );
  };

  const reject = async (pid: string) => {
    await api.post("/api/proposals/" + pid + "/reject");
    setList((list) =>
      list.map((x) => (x._id === pid ? { ...x, status: "rejected" } : x))
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Proposals
      </Typography>

      {role === "freelancer" && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Stack spacing={2} component="form" onSubmit={send}>
            <TextField
              label="Cover Letter"
              multiline
              rows={4}
              fullWidth
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
            />
            <TextField
              label="Bid Amount"
              type="number"
              fullWidth
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Send Proposal
            </Button>
          </Stack>
        </Paper>
      )}

      {role === "client" && (
        <Stack spacing={2}>
          {list.map((p) => (
            <Card key={p._id} variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {p.freelancer?.name} — ₦{p.bidAmount} — {p.status}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {p.coverLetter}
                </Typography>
              </CardContent>
              {p.status === "pending" && (
                <CardActions>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => accept(p._id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => reject(p._id)}
                  >
                    Reject
                  </Button>
                </CardActions>
              )}
            </Card>
          ))}
        </Stack>
      )}

      {msg && (
        <Alert
          severity={msg.startsWith("✅") ? "success" : "error"}
          sx={{ mt: 3 }}
        >
          {msg}
        </Alert>
      )}
    </Container>
  );
}
