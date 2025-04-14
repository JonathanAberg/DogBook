import React, { useState } from "react";
import { updateProfilePicture } from "../services/api";

const ProfilePictureUploader = ({ dogId, currentImagePath, onUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      console.log("Updating profile picture with:");
      console.log("- Dog ID:", dogId);
      console.log("- Old image path:", currentImagePath);

      const updatedDog = await updateProfilePicture(
        dogId,
        file,
        currentImagePath
      );
      setIsUploading(false);

      if (onUpdate) {
        onUpdate(updatedDog);
      }
    } catch (error) {
      setError("Failed to update profile picture");
      setIsUploading(false);
      console.error("Profile picture update error:", error);
    }
  };

  return (
    <div className="profile-picture-uploader">
      <input
        type="file"
        id={`profile-picture-${dogId}`}
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        style={{ display: "none" }}
      />
      <label
        htmlFor={`profile-picture-${dogId}`}
        className="profile-picture-upload-button"
      >
        {isUploading ? "Uploading..." : "Change Picture"}
      </label>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ProfilePictureUploader;
