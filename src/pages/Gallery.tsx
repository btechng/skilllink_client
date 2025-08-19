import React, { useEffect, useState } from "react";
import api from "../components/api";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Avatar,
} from "@mui/material";

type Work = {
  _id: string;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  user?: { name: string; profileImage?: string; title?: string };
};

export default function Gallery() {
  const [items, setItems] = useState<Work[]>([]);

  useEffect(() => {
    api.get("/api/works").then((res) => setItems(res.data));
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        py: 4,
        px: 2,
        fontFamily: "Inter, system-ui",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        Public Gallery
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {items.map((x) => (
          <Card
            key={x._id}
            sx={{
              width: { xs: "100%", sm: "48%", md: "23%" },
              borderRadius: 3,
              boxShadow: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}
            >
              <Avatar
                src={x.user?.profileImage || "https://via.placeholder.com/32"}
                alt={x.user?.name}
                sx={{ width: 32, height: 32 }}
              />
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{x.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {x.user?.name} {x.user?.title ? "• " + x.user.title : ""}
                </Typography>
              </Box>
            </CardContent>

            {x.mediaType === "image" ? (
              <CardMedia
                component="img"
                image={x.mediaUrl}
                alt={x.title}
                sx={{ borderRadius: 1, mt: 1 }}
              />
            ) : (
              <Box sx={{ mt: 1 }}>
                <video
                  src={x.mediaUrl}
                  controls
                  style={{ width: "100%", borderRadius: 8 }}
                />
              </Box>
            )}
          </Card>
        ))}
      </Box>
    </Box>
  );
}
