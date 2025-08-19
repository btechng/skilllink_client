import React, { useState } from "react";

type Props = {
  onUploaded: (url: string, type?: "image" | "video") => void;
};

export default function CloudinaryUpload({ onUploaded }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError("❌ Cloudinary environment variables are missing");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const isVideo = file.type.startsWith("video/");
      const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${
        isVideo ? "video" : "image"
      }/upload`;

      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(endpoint, { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onUploaded(data.secure_url, isVideo ? "video" : "image");
    } catch (e: any) {
      setError(e.message || "Upload error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <input type="file" accept="image/*,video/*" onChange={handleFile} />
      {loading && <span>Uploading...</span>}
      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
}
