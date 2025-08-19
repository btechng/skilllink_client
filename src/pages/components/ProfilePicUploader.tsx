import React from "react";
import CloudinaryUpload from "../../components/CloudinaryUpload";
import { updateProfile } from "../../components/api";

export default function ProfilePicUploader() {
  async function onUploaded(url: string) {
    try {
      await updateProfile({ profileImage: url });
      alert("✅ Profile image updated!");
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("❌ Failed to update profile.");
    }
  }

  return <CloudinaryUpload onUploaded={onUploaded} />;
}
