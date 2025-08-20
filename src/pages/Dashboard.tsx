// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useAuth } from "../context/useAuth";
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

type Message = {
  _id: string;
  from: { _id: string; name: string; profileImage: string };
  to: { _id: string; name: string; profileImage: string };
  content: string;
  createdAt: string;
};

export default function Dashboard() {
  const { user: me, setUser } = useAuth();

  const [works, setWorks] = useState<Work[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [profileData, setProfileData] = useState<any>({});
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadType, setUploadType] = useState<"image" | "video">("image");

  // Chat modal state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatUser, setChatUser] = useState<{
    _id: string;
    name: string;
    profileImage: string;
  } | null>(null);
  const [chatInput, setChatInput] = useState("");

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    if (me) {
      setProfileData(me);
      api
        .get("/api/works/me")
        .then((res) => setWorks(res.data))
        .catch(() => {});
      api
        .get("/api/messages") // ✅ FIX: fetch messages for logged-in user
        .then((res) => setMessages(res.data))
        .catch(() => {});
    }
  }, [me]);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Update profile
  const updateProfile = async () => {
    try {
      const { data } = await api.put("/api/auth/me", profileData);
      setUser(data);
      showSnackbar("Profile updated successfully!", "success");
    } catch (e: any) {
      showSnackbar(
        e.response?.data?.message || "Error updating profile",
        "error"
      );
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
      showSnackbar("Work uploaded successfully!", "success");
    } catch (e: any) {
      showSnackbar(e.response?.data?.message || "Error creating work", "error");
    }
  };

  // Open chat modal
  const openChat = (user: {
    _id: string;
    name: string;
    profileImage: string;
  }) => {
    setChatUser(user);
    setChatInput("");
    setChatOpen(true);
  };

  // Send chat message
  const sendChatMessage = async () => {
    if (!chatUser || !chatInput.trim()) return;
    try {
      const { data } = await api.post("/api/messages", {
        to: chatUser._id,
        content: chatInput,
      }); // ✅ FIX: correct endpoint
      setMessages((prev) => [...prev, data]); // ✅ include new message
      setChatInput("");
      showSnackbar("Message sent!", "success");
    } catch (e: any) {
      showSnackbar(
        e.response?.data?.message || "Error sending message",
        "error"
      );
    }
  };

  if (!me)
    return (
      <Typography align="center">
        Please login to view your dashboard.
      </Typography>
    );

  // Filter messages for chat with selected user
  const chatMessages = chatUser
    ? messages.filter(
        (m) => m.from._id === chatUser._id || m.to._id === chatUser._id
      )
    : [];

  return (
    <Box
      sx={{
        maxWidth: 1000,
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

      {/* Messages Section */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Messages
        </Typography>
        {messages.length === 0 && <Typography>No messages yet.</Typography>}
        <List
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
          }}
        >
          {messages.map((msgItem) => (
            <React.Fragment key={msgItem._id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={msgItem.from.profileImage} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${msgItem.from.name} → ${msgItem.to.name}`}
                  secondary={msgItem.content}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => openChat(msgItem.from)}
                >
                  Chat
                </Button>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Chat Modal */}
      <Dialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Chat with {chatUser?.name}</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          {chatMessages.map((m) => (
            <Box
              key={m._id}
              sx={{
                display: "flex",
                flexDirection: me?._id === m.from._id ? "row-reverse" : "row",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <Avatar
                src={m.from.profileImage}
                sx={{ width: 32, height: 32 }}
              />
              <Paper
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: me?._id === m.from._id ? "green.100" : "grey.100",
                  maxWidth: "70%",
                }}
              >
                <Typography variant="body2">{m.content}</Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", textAlign: "right" }}
                >
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Paper>
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Type a message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <Button variant="contained" onClick={sendChatMessage}>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
