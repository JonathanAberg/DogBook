// Anrop till backend
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

export async function getDogById(id) {
  const response = await axios.get(`${API_URL}/dogs/${id}`);
  return response.data;
}

export async function createDog(dogData) {
  const response = await axios.post(`${API_URL}/dogs`, dogData);
  return response.data;
}

export async function updateDog(id, dogData) {
  const response = await axios.put(`${API_URL}/dogs/${id}`, dogData);
  return response.data;
}

export async function deleteDog(id) {
  await axios.delete(`${API_URL}/dogs/${id}`);
}

export async function addFriend(dogId, friendId) {
  try {
    console.log("Sending addFriend request:", { dogId, friendId });
    const response = await axios.patch(
      `${API_URL}/dogs/${dogId}/addFriend/${friendId}`
    );
    console.log("AddFriend response:", response.data);
    return response.data;
  } catch (error) {
    console.error("AddFriend error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
}

export async function removeFriend(dogId, friendId) {
  const response = await axios.patch(
    `${API_URL}/dogs/${dogId}/removeFriend/${friendId}`
  );
  return response.data;
}
