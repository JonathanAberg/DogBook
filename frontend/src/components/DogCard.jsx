import React from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../services/api";
import "./DogCard.css";

const DogCard = ({ dog, onDelete }) => {
  const handleImageError = (e) => {
    e.target.src = getImageUrl(); // Fallback to default
    e.target.onerror = null; // Prevent infinite loop
  };

  const statusClass = dog.present ? "present" : "absent";

  return (
    <div className={`dog-card ${statusClass}`}>
      <div
        className="status-indicator"
        title={dog.present ? "På dagis" : "Inte på dagis"}
      ></div>
      <Link to={`/profile/${dog._id}`}>
        <div className="dog-image-container">
          <img
            src={getImageUrl(dog.imagePath)}
            alt={dog.name}
            onError={handleImageError}
            className="dog-profile-image"
          />
        </div>
        <h2>@{dog.name}</h2>
      </Link>
      {onDelete && (
        <button onClick={() => onDelete(dog._id)} className="delete-btn">
          Delete
        </button>
      )}
    </div>
  );
};

export default DogCard;
