import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../components/api";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
} from "@mui/material";

type Job = {
  _id: string;
  title: string;
  budget: number;
  status: string;
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    api.get("/api/jobs").then((res) => setJobs(res.data));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "success";
      case "closed":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Jobs</Typography>
        <Button
          component={Link}
          to="/jobs/new"
          variant="contained"
          color="primary"
        >
          Post a Job
        </Button>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
        {jobs.map((job) => (
          <Card
            key={job._id}
            variant="outlined"
            sx={{
              width: { xs: "100%", sm: 300 },
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {job.title}
              </Typography>
              <Typography color="textSecondary">
                Budget: ₦{job.budget.toLocaleString()}
              </Typography>
              <Box mt={1}>
                <Chip
                  label={job.status}
                  color={getStatusColor(job.status)}
                  size="small"
                />
              </Box>
            </CardContent>
            <CardActions>
              <Button
                component={Link}
                to={`/jobs/${job._id}`}
                size="small"
                color="primary"
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {jobs.length === 0 && (
        <Typography mt={4} align="center" color="textSecondary">
          No jobs found.
        </Typography>
      )}
    </Container>
  );
}
