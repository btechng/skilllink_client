import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Alert,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import api from "../components/api";
import CloudinaryUpload from "../components/CloudinaryUpload";

type Work = {
  _id: string;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt: string;
};

export default function Dashboard() {
  const { user: me, setUser } = useAuth();
  const [works, setWorks] = useState<Work[]>([]);
  const [profileData, setProfileData] = useState<any>({});
  const [msg, setMsg] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string>("");
  const [uploadType, setUploadType] = useState<"image" | "video">("image");

  // Load user data and works
  useEffect(() => {
    if (me) {
      setProfileData(me);
      api
        .get("/api/works/me")
        .then((res) => setWorks(res.data))
        .catch(() => {});
    }
  }, [me]);

  // Update profile
  const updateProfile = async () => {
    try {
      const { data } = await api.put("/api/auth/me", profileData);
      setUser(data);
      setMsg("✅ Profile updated");
    } catch (e: any) {
      setMsg(e.response?.data?.message || "❌ Error updating profile");
    }
  };

  // Create new work
  const createWork = async () => {
    if (!uploadUrl) return;
    try {
      const { data } = await api.post("/api/works", {
        title: profileData.newWorkTitle,
        description: profileData.newWorkDescription,
        mediaUrl: uploadUrl,
        mediaType: uploadType,
      });
      setWorks((prev) => [data, ...prev]);
      setProfileData({
        ...profileData,
        newWorkTitle: "",
        newWorkDescription: "",
      });
      setUploadUrl("");
      setMsg("✅ Work created");
    } catch (e: any) {
      setMsg(e.response?.data?.message || "❌ Error creating work");
    }
  };

  if (!me) return <Typography>Please login to view dashboard.</Typography>;

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        py: 4,
        px: 2,
        fontFamily: "Inter, system-ui",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Typography variant="h4">Dashboard</Typography>

      {/* Profile Section */}
      <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar src={me.profileImage || ""} sx={{ width: 64, height: 64 }} />
        <Box sx={{ flex: 1 }}>
          <TextField
            label="Name"
            value={profileData.name || ""}
            onChange={(e) =>
              setProfileData({ ...profileData, name: e.target.value })
            }
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Title"
            value={profileData.title || ""}
            onChange={(e) =>
              setProfileData({ ...profileData, title: e.target.value })
            }
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Bio"
            value={profileData.bio || ""}
            onChange={(e) =>
              setProfileData({ ...profileData, bio: e.target.value })
            }
            fullWidth
            multiline
            rows={3}
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={updateProfile}>
            Save Profile
          </Button>
          {msg && (
            <Alert
              severity={msg.startsWith("✅") ? "success" : "error"}
              sx={{ mt: 1 }}
            >
              {msg}
            </Alert>
          )}
        </Box>
      </Paper>

      {/* Upload Work Section */}
      <Paper sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Upload New Work</Typography>
        <CloudinaryUpload
          onUploaded={(url, type) => {
            setUploadUrl(url);
            setUploadType(type || "image");
          }}
        />
        {uploadUrl && (
          <Box>
            <TextField
              label="Title"
              value={profileData.newWorkTitle || ""}
              onChange={(e) =>
                setProfileData({ ...profileData, newWorkTitle: e.target.value })
              }
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              label="Description"
              value={profileData.newWorkDescription || ""}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  newWorkDescription: e.target.value,
                })
              }
              fullWidth
              multiline
              rows={2}
            />
            <Button variant="contained" onClick={createWork}>
              Save Work
            </Button>
          </Box>
        )}
      </Paper>

      {/* Works Gallery */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          My Works
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {works.map((w) => (
            <Paper key={w._id} sx={{ p: 1, borderRadius: 2, width: 220 }}>
              <Typography sx={{ fontWeight: 600 }}>{w.title}</Typography>
              {w.mediaType === "image" ? (
                <img
                  src={w.mediaUrl}
                  style={{ width: "100%", borderRadius: 6 }}
                />
              ) : (
                <video
                  src={w.mediaUrl}
                  controls
                  style={{ width: "100%", borderRadius: 6 }}
                />
              )}
              <Typography variant="caption">
                {new Date(w.createdAt).toLocaleString()}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
