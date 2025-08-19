import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import api from "../components/api";
import {
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    api.get("/api/jobs/" + id).then((r) => setJob(r.data));
  }, [id]);

  if (!job)
    return (
      <Container sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight="bold">
            {job.title}
          </Typography>
          <Typography variant="body1">{job.description}</Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label={`Budget: ₦${job.budget}`} color="primary" />
            <Chip
              label={`Status: ${job.status}`}
              color={job.status === "open" ? "success" : "default"}
            />
          </Stack>

          <Button
            component={RouterLink}
            to={`/jobs/${id}/proposals`}
            variant="contained"
            color="secondary"
          >
            View / Send Proposals
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
