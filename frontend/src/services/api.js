import axios from "axios";

const API_URL = "http://localhost:5001"; // Backend-URL

export async function getDogs() {
  try {
    const response = await axios.get(`${API_URL}/dogs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dogs:", error);
    throw error;
  }
}

export const getDogById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/dogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fel vid hämtning av hund:", error);
    return null;
  }
};

export const createDog = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/dogs`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fel vid skapande av hund:", error);
    throw error;
  }
};

// Enhanced helper function to get image URL with fallback to default
export const getImageUrl = (imagePath) => {
  // If no image path provided, use default
  if (!imagePath) {
    return `${API_URL}/uploads/default-dog.png`;
  }

  // If it's a relative path starting with /uploads/, prepend the API URL
  if (imagePath.startsWith("/uploads/")) {
    return `${API_URL}${imagePath}`;
  }

  // If path doesn't include 'uploads' at all, use default
  if (!imagePath.includes("uploads")) {
    return `${API_URL}/uploads/default-dog.png`;
  }

  // Otherwise return the path as-is
  return imagePath;
};

export const updateDog = async (id, formData) => {
  try {
    const response = await axios.patch(`${API_URL}/dogs/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fel vid uppdatering av hund:", error);
    throw error;
  }
};

export const deleteDog = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/dogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fel vid borttagning av hund:", error);
    throw error;
  }
};

export async function addFriend(dogId, friendId) {
  try {
    const response = await axios.patch(
      `${API_URL}/dogs/${dogId}/addFriend/${friendId}`
    );
    return response.data;
  } catch (error) {
    console.error("AddFriend error:", error.message);
    throw error;
  }
}

export async function removeFriend(dogId, friendId) {
  const response = await axios.patch(
    `${API_URL}/dogs/${dogId}/removeFriend/${friendId}`
  );
  return response.data;
}
