import React, { useEffect, useState } from "react";
import api from "../components/api";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  Tabs,
  Tab,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

type User = { _id: string; name: string; email: string; role: string };
type Job = { _id: string; title: string; status: string };
type Tx = {
  _id: string;
  job?: { title: string };
  amount: number;
  status: string;
};

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tx, setTx] = useState<Tx[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/api/admin/users"),
      api.get("/api/admin/jobs"),
      api.get("/api/admin/transactions"),
    ])
      .then(([u, j, t]) => {
        setUsers(u.data);
        setJobs(j.data);
        setTx(t.data);
      })
      .catch((e) =>
        setError(e.response?.data?.message || "Admin auth required")
      )
      .finally(() => setLoading(false));
  }, []);

  const banUser = async (id: string) => {
    await api.delete("/api/admin/users/" + id);
    setUsers((arr) => arr.filter((u) => u._id !== id));
  };

  if (loading)
    return (
      <Container sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Paper>
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Users" />
          <Tab label="Jobs" />
          <Tab label="Transactions" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 2 }}>
        {tab === 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => banUser(u._id)}
                      >
                        Ban
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tab === 1 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((j) => (
                  <TableRow key={j._id}>
                    <TableCell>{j.title}</TableCell>
                    <TableCell>{j.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tab === 2 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tx.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell>{t.job?.title || "N/A"}</TableCell>
                    <TableCell>₦{t.amount}</TableCell>
                    <TableCell>{t.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
}
